const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app, initDB } = require('../server');

let server;
let baseUrl;

before(async () => {
  delete process.env.MONGODB_URI; // Use isolated local test mode
  await initDB();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => {
  if (server) server.close();
});

describe('Lagos Digital Levy & IGR API', () => {
  it('returns healthy status on /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });

  it('issues a new digital levy pass and blocks duplicate active levy in same zone', async () => {
    const uniquePlate = `LAG-TEST-${Math.floor(100 + Math.random() * 899)}`;
    const payload = {
      operatorName: 'Tunde Bakare',
      identifier: uniquePlate,
      operatorType: 'Keke Napep (Tricycle)',
      zone: 'Ikeja / Oshodi',
    };

    const first = await fetch(`${baseUrl}/api/passes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(first.status, 201);
    const created = await first.json();
    assert.equal(created.status, 'ACTIVE');
    assert.ok(created.referenceCode.startsWith('LGS-IGR-'));

    // Second attempt for same active plate + zone must be blocked (409 Conflict)
    const duplicate = await fetch(`${baseUrl}/api/passes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(duplicate.status, 409);
  });

  it('verifies an active pass and records an officer audit log entry', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'LGS-IGR-1001', officerName: 'Officer Balogun' }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.outcome, 'VALID_ACTIVE_PASS');
    assert.equal(data.logEntry.officerName, 'Officer Balogun');
  });
});