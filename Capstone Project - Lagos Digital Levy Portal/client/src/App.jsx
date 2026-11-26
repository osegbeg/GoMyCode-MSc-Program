import React, { useEffect, useState } from 'react';
import './styles.css';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const OPERATOR_TYPES = [
  'Keke Napep (Tricycle)',
  'Commercial Bus (Danfo / Korope)',
  'Dispatch / Okada Rider',
  'Market Trader / Wheelbarrow Pusher',
];

const ZONES = [
  'Ikeja / Oshodi',
  'Mile 12 - CMS Corridor',
  'Yaba / Surulere',
  'Ladipo / Balogun Market',
];

export default function App() {
  const [tab, setTab] = useState('operator');
  const [passes, setPasses] = useState([]);
  const [rates, setRates] = useState([]);
  const [dbMode, setDbMode] = useState('Connected');
  const [summary, setSummary] = useState({
    totalPasses: 0,
    activeCount: 0,
    expiredCount: 0,
    totalRecordedNGN: 0,
    byOperatorType: {},
    byZone: {},
  });

  // US-1 Operator Form
  const [operatorName, setOperatorName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [operatorType, setOperatorType] = useState(OPERATOR_TYPES[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [latestPass, setLatestPass] = useState(null);
  const [formError, setFormError] = useState('');

  // US-4 & US-5 Officer Verification
  const [verifyQuery, setVerifyQuery] = useState('');
  const [officerName, setOfficerName] = useState('Inspector Adewale');
  const [verifyResult, setVerifyResult] = useState(null);

  // US-8 Admin Filters
  const [filterZone, setFilterZone] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  async function refreshData() {
    try {
      const params = new URLSearchParams({
        zone: filterZone,
        status: filterStatus,
        search: searchTerm,
      });
      const [healthRes, passRes, rateRes] = await Promise.all([
        fetch(`${API_BASE}/api/health`),
        fetch(`${API_BASE}/api/passes?${params.toString()}`),
        fetch(`${API_BASE}/api/rates`),
      ]);
      if (healthRes.ok) {
        const h = await healthRes.json();
        setDbMode(h.database || 'Connected');
      }
      if (passRes.ok) {
        const passData = await passRes.json();
        setPasses(passData.passes || []);
        if (passData.summary) setSummary(passData.summary);
      }
      if (rateRes.ok) {
        setRates(await rateRes.json());
      }
    } catch (err) {
      console.error('Failed to refresh portal data:', err);
    }
  }

  useEffect(() => {
    refreshData();
  }, [filterZone, filterStatus, searchTerm]);

  const previewRate =
    rates.find((r) => r.operatorType === operatorType && r.zone === zone) ||
    rates.find((r) => r.operatorType === operatorType) || { amount: 500, durationHours: 24 };

  async function handleIssuePass(e) {
    e.preventDefault();
    setFormError('');
    const res = await fetch(`${API_BASE}/api/passes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName, identifier, operatorType, zone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error || 'Could not issue pass');
      if (data.existingPass) setLatestPass(data.existingPass);
      return;
    }
    setLatestPass(data);
    setOperatorName('');
    setIdentifier('');
    refreshData();
  }

  async function handleRenew(referenceCode) {
    setFormError('');
    const res = await fetch(`${API_BASE}/api/passes/${referenceCode}/renew`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setLatestPass(updated);
      refreshData();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: verifyQuery, officerName }),
    });
    if (res.ok) {
      setVerifyResult(await res.json());
    }
  }

  async function handleRateUpdate(rateId, amount) {
    await fetch(`${API_BASE}/api/rates/${rateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    refreshData();
  }

  return (
    <div className="app-shell">
      <header className="hero-banner">
        <div className="hero-top">
          <span className="hero-badge">LAGOS STATE TRANSIT &amp; MARKET IGR PORTAL</span>
          <span className="hero-badge">DB: {dbMode}</span>
        </div>
        <h1>Lagos Digital Levy &amp; IGR Transparency System</h1>
        <p>
          One-time daily digital passes for Danfo, Keke Napep, Okada &amp; Market Traders — eliminating street harassment, verifying vehicles against &ldquo;one-chance&rdquo; risks, and tracking state IGR.
        </p>
      </header>

      <nav className="tabs">
        <button className={`tab-btn ${tab === 'operator' ? 'active' : ''}`} onClick={() => setTab('operator')}>
          1. Operator Pass &amp; Wallet
        </button>
        <button className={`tab-btn ${tab === 'verify' ? 'active' : ''}`} onClick={() => setTab('verify')}>
          2. Field Officer &amp; Commuter Verification
        </button>
        <button className={`tab-btn ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
          3. IGR Transparency Dashboard
        </button>
      </nav>

      {tab === 'operator' && (
        <div className="grid-2">
          <section className="card">
            <h2>Issue Digital Levy Pass</h2>
            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleIssuePass} className="field-group">
              <label>
                Operator / Driver / Trader Full Name
                <input
                  placeholder="e.g. Musa Abdullahi"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                />
              </label>

              <label>
                Vehicle Plate / Keke ID / Market Stall or Barrow Tag
                <input
                  placeholder="e.g. LAG-409-IKJ"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </label>

              <label>
                Operator Category
                <select value={operatorType} onChange={(e) => setOperatorType(e.target.value)}>
                  {OPERATOR_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label>
                Operating Corridor / Market Zone
                <select value={zone} onChange={(e) => setZone(e.target.value)}>
                  {ZONES.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </label>

              <div className="fee-preview">
                <span>Official Tariff ({previewRate.durationHours}h Coverage)</span>
                <strong>₦{Number(previewRate.amount).toLocaleString()}</strong>
              </div>

              <button type="submit" className="btn-primary">
                Confirm Payment &amp; Generate Digital Pass
              </button>
            </form>

            {latestPass && (
              <div style={{ marginTop: 16 }} className="digital-pass-ticket">
                <div>
                  <span className={`pill ${latestPass.status === 'ACTIVE' ? 'pill-active' : 'pill-expired'}`}>
                    {latestPass.status} DIGITAL PASS
                  </span>
                  <h3 style={{ margin: '6px 0 4px' }}>{latestPass.referenceCode}</h3>
                  <div style={{ fontSize: '0.9rem' }}>
                    <strong>{latestPass.operatorName}</strong> · {latestPass.identifier}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#065f46' }}>
                    {latestPass.zone} · ₦{latestPass.amount} · Valid until {new Date(latestPass.expiresAt).toLocaleString()}
                  </div>
                </div>
                <div className="qr-box" title="Digital Verification Stamp" />
              </div>
            )}
          </section>

          <section className="card">
            <h2>Active &amp; Recent Passes</h2>
            {passes.length === 0 ? (
              <p style={{ color: '#64748b' }}>No levy passes recorded yet.</p>
            ) : (
              passes.map((p) => (
                <div key={p.referenceCode} className="pass-row">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>{p.referenceCode}</strong>
                      <span className={`pill ${p.status === 'ACTIVE' ? 'pill-active' : 'pill-expired'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', marginTop: 2 }}>
                      {p.operatorName} (<strong>{p.identifier}</strong>) — ₦{Number(p.amount).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {p.operatorType} · {p.zone}
                    </div>
                  </div>
                  <button className="btn-secondary" onClick={() => handleRenew(p.referenceCode)}>
                    Renew 24h
                  </button>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {tab === 'verify' && (
        <div className="grid-2">
          <section className="card">
            <h2>Field Officer &amp; Commuter Pass Lookup</h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: 0 }}>
              Verify compliance and vehicle registration digitally by plate number, operator ID, or pass code—preventing street extortion and helping commuters avoid unverified &ldquo;one-chance&rdquo; vehicles.
            </p>
            <form onSubmit={handleVerify} className="field-group">
              <label>
                Inspecting Officer Name / Badge (or Commuter Check)
                <input value={officerName} onChange={(e) => setOfficerName(e.target.value)} required />
              </label>
              <label>
                Plate Number / Operator ID / Reference Code
                <input
                  placeholder="Try LGS-IGR-1001 or LAG-123-XA"
                  value={verifyQuery}
                  onChange={(e) => setVerifyQuery(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn-primary">Verify Vehicle &amp; Levy Status</button>
            </form>
          </section>

          <section className="card">
            <h2>Verification Result &amp; Audit Trail</h2>
            {!verifyResult ? (
              <p style={{ color: '#64748b' }}>Run a lookup on the left to inspect pass validity and log the check.</p>
            ) : (
              <>
                <div className="pass-row" style={{ background: '#f8fafc' }}>
                  <div>
                    <small style={{ color: '#64748b' }}>CHECK OUTCOME</small>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{verifyResult.outcome}</div>
                  </div>
                  <span className={`pill ${verifyResult.outcome === 'VALID_ACTIVE_PASS' ? 'pill-active' : 'pill-expired'}`}>
                    {verifyResult.matches.length} Match(es)
                  </span>
                </div>

                {verifyResult.matches.map((m) => (
                  <div key={m.referenceCode} className="pass-row">
                    <div>
                      <strong>{m.referenceCode}</strong> · {m.operatorName} ({m.identifier})
                      <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                        {m.zone} · Expires {new Date(m.expiresAt).toLocaleString()}
                      </div>
                    </div>
                    <span className={`pill ${m.status === 'ACTIVE' ? 'pill-active' : 'pill-expired'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}

                <h3 style={{ marginTop: 16 }}>Recent Field Audit Log</h3>
                {verifyResult.recentLogs.map((log) => (
                  <div key={log.logId} style={{ fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <strong>{log.query}</strong> → {log.outcome} · <em>{log.officerName}</em> ({new Date(log.checkedAt).toLocaleTimeString()})
                  </div>
                ))}
              </>
            )}
          </section>
        </div>
      )}

      {tab === 'admin' && (
        <section>
          <div className="kpi-grid">
            <div className="kpi-card">
              <small>TOTAL REMITTED IGR</small>
              <div className="kpi-value">₦{summary.totalRecordedNGN.toLocaleString()}</div>
            </div>
            <div className="kpi-card">
              <small>TOTAL PASSES ISSUED</small>
              <div className="kpi-value">{summary.totalPasses}</div>
            </div>
            <div className="kpi-card">
              <small>ACTIVE PASSES</small>
              <div className="kpi-value">{summary.activeCount}</div>
            </div>
            <div className="kpi-card">
              <small>EXPIRED PASSES</small>
              <div className="kpi-value">{summary.expiredCount}</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="card">
              <h3>IGR Revenue by Zone / Corridor</h3>
              {Object.entries(summary.byZone).map(([zName, amount]) => {
                const pct = summary.totalRecordedNGN ? Math.round((amount / summary.totalRecordedNGN) * 100) : 0;
                return (
                  <div key={zName} className="bar-row">
                    <div className="bar-label">
                      <span>{zName}</span>
                      <strong>₦{Number(amount).toLocaleString()} ({pct}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3>Official Levy Tariff Schedule</h3>
              {rates.map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{r.operatorType}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.zone} · {r.durationHours}h</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>₦</span>
                    <input
                      type="number"
                      defaultValue={r.amount}
                      style={{ width: 90 }}
                      onBlur={(e) => handleRateUpdate(r.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>IGR Ledger &amp; Remittance Audit Trail</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
              <input
                placeholder="Search code, plate, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
                <option value="ALL">All Lagos Zones</option>
                {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="ALL">All Pass Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>

            {passes.map((p) => (
              <div key={p.referenceCode} className="pass-row">
                <div>
                  <strong>{p.referenceCode}</strong> · {p.operatorName} ({p.identifier}) · {p.zone}
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {p.operatorType} · Issued {new Date(p.issuedAt).toLocaleString()} · {p.remittanceStatus}
                  </div>
                </div>
                <div>
                  <strong style={{ marginRight: 10 }}>₦{Number(p.amount).toLocaleString()}</strong>
                  <span className={`pill ${p.status === 'ACTIVE' ? 'pill-active' : 'pill-expired'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}