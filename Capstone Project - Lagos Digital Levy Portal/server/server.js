const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDB, repo } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function withStatus(pass) {
  const now = Date.now();
  const exp = new Date(pass.expiresAt).getTime();
  const isActive = exp > now;
  const remainingMinutes = isActive ? Math.max(1, Math.round((exp - now) / 60000)) : 0;
  return {
    ...pass,
    status: isActive ? 'ACTIVE' : 'EXPIRED',
    remainingMinutes,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Lagos Digital Levy & IGR Transparency API',
    database: repo.isMongo() ? 'MongoDB' : 'Local JSON Store',
  });
});

// US-2, US-3, US-6, US-8: List passes + IGR analytics summary
app.get('/api/passes', async (req, res) => {
  try {
    const { zone, operatorType, status, search } = req.query;
    const rawPasses = await repo.getAllPasses();
    const allWithStatus = rawPasses.map(withStatus);

    let items = [...allWithStatus];
    if (zone && zone !== 'ALL') items = items.filter((p) => p.zone === zone);
    if (operatorType && operatorType !== 'ALL') items = items.filter((p) => p.operatorType === operatorType);
    if (status && status !== 'ALL') items = items.filter((p) => p.status === status);
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.referenceCode.toLowerCase().includes(q) ||
          p.identifier.toLowerCase().includes(q) ||
          p.operatorName.toLowerCase().includes(q)
      );
    }

    const totalRecordedNGN = allWithStatus.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const activeCount = allWithStatus.filter((p) => p.status === 'ACTIVE').length;
    const expiredCount = allWithStatus.filter((p) => p.status === 'EXPIRED').length;

    const byOperatorType = allWithStatus.reduce((acc, p) => {
      acc[p.operatorType] = (acc[p.operatorType] || 0) + Number(p.amount || 0);
      return acc;
    }, {});

    const byZone = allWithStatus.reduce((acc, p) => {
      acc[p.zone] = (acc[p.zone] || 0) + Number(p.amount || 0);
      return acc;
    }, {});

    res.json({
      passes: items,
      summary: {
        totalPasses: allWithStatus.length,
        activeCount,
        expiredCount,
        totalRecordedNGN,
        byOperatorType,
        byZone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve levy passes', details: err.message });
  }
});

// US-1: Issue a new digital levy pass (blocks duplicate active pass in same zone)
app.post('/api/passes', async (req, res) => {
  try {
    const { operatorName, identifier, operatorType, zone } = req.body;
    if (!operatorName?.trim() || !identifier?.trim() || !operatorType || !zone) {
      return res.status(400).json({ error: 'operatorName, identifier, operatorType, and zone are required' });
    }

    const cleanId = identifier.trim().toUpperCase();
    const existing = (await repo.getAllPasses())
      .map(withStatus)
      .find((p) => p.identifier === cleanId && p.zone === zone && p.status === 'ACTIVE');

    if (existing) {
      return res.status(409).json({
        error: `Active pass (${existing.referenceCode}) already exists for ${cleanId} in ${zone}. Multiple daily levy charges prevented.`,
        existingPass: existing,
      });
    }

    const rates = await repo.getRates();
    const matchedRate =
      rates.find((r) => r.operatorType === operatorType && r.zone === zone) ||
      rates.find((r) => r.operatorType === operatorType) || { amount: 500, durationHours: 24 };

    const now = Date.now();
    const newPass = {
      referenceCode: `LGS-IGR-${Math.floor(100000 + Math.random() * 900000)}`,
      operatorName: operatorName.trim(),
      identifier: cleanId,
      operatorType,
      zone,
      amount: matchedRate.amount,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + matchedRate.durationHours * 3600 * 1000).toISOString(),
      remittanceStatus: 'REMITTED_TO_IGR',
    };

    await repo.createPass(newPass);
    return res.status(201).json(withStatus(newPass));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to issue digital levy pass', details: err.message });
  }
});

// US-3: Renew an existing pass
app.post('/api/passes/:referenceCode/renew', async (req, res) => {
  try {
    const all = await repo.getAllPasses();
    const current = all.find(
      (p) => p.referenceCode.toLowerCase() === req.params.referenceCode.toLowerCase()
    );
    if (!current) {
      return res.status(404).json({ error: 'Pass not found' });
    }

    const rates = await repo.getRates();
    const matchedRate = rates.find((r) => r.operatorType === current.operatorType) || {
      amount: current.amount,
      durationHours: 24,
    };

    const now = Date.now();
    const updated = await repo.updatePassByRef(current.referenceCode, {
      amount: matchedRate.amount,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + matchedRate.durationHours * 3600 * 1000).toISOString(),
      remittanceStatus: 'REMITTED_TO_IGR',
    });

    return res.json(withStatus(updated));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to renew pass', details: err.message });
  }
});

// US-4 & US-5: Officer lookup + verification audit log
app.post('/api/verify', async (req, res) => {
  try {
    const { query, officerName = 'Field Inspector' } = req.body;
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Lookup query (plate, operator ID, or reference code) is required' });
    }

    const q = query.trim().toLowerCase();
    const matches = (await repo.getAllPasses())
      .map(withStatus)
      .filter(
        (p) =>
          p.referenceCode.toLowerCase() === q ||
          p.identifier.toLowerCase() === q ||
          p.operatorName.toLowerCase().includes(q)
      );

    const outcome =
      matches.length === 0
        ? 'NO_PASS_FOUND'
        : matches.some((m) => m.status === 'ACTIVE')
        ? 'VALID_ACTIVE_PASS'
        : 'PASS_EXPIRED';

    const logEntry = {
      logId: `CHK-${Date.now()}`,
      query: query.trim(),
      officerName: officerName.trim() || 'Field Inspector',
      outcome,
      checkedAt: new Date().toISOString(),
    };

    const recentLogs = await repo.addVerificationLog(logEntry);
    return res.json({ outcome, matches, logEntry, recentLogs });
  } catch (err) {
    return res.status(500).json({ error: 'Verification check failed', details: err.message });
  }
});

app.get('/api/verify/logs', async (_req, res) => {
  const logs = await repo.getRecentLogs();
  res.json(logs);
});

// US-7: View and update standard levy rates
app.get('/api/rates', async (_req, res) => {
  const rates = await repo.getRates();
  res.json(rates);
});

app.put('/api/rates/:id', async (req, res) => {
  const { amount, durationHours } = req.body;
  const updates = {};
  if (amount !== undefined && Number(amount) >= 0) updates.amount = Number(amount);
  if (durationHours !== undefined && Number(durationHours) > 0) updates.durationHours = Number(durationHours);

  const updated = await repo.updateRate(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Rate rule not found' });
  }
  return res.json(updated);
});

// Serve compiled React frontend (client/dist) on the same single URL
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(clientDistPath, 'index.html'));
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Lagos Digital Levy & IGR Portal running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, initDB };