import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// ---- Types (mirror backend lib/sybil.ts; inlined so the engine's module-level
// side effects never get pulled into the client bundle — same pattern as BridgeDemo) ----

type Band = 'low' | 'medium' | 'high';

interface RiskSignal {
  name: string;
  value: number | string;
  points: number;
  note: string;
}

interface WalletReport {
  address: string;
  score: number;
  band: Band;
  signals: RiskSignal[];
  clusterId: number | null;
}

interface ClusterSummary {
  clusterId: number;
  addresses: string[];
  maxBand: Band;
  avgScore: number;
}

interface AnalyzeResult {
  reports: WalletReport[];
  clusters: ClusterSummary[];
}

// The 7 planted demo addresses (5 sybils + 2 organics) — mirrors DEMO_ADDRESSES.
const DEMO_ADDRESSES = [
  '0xSYBIL0000000000000000000000000000000001',
  '0xSYBIL0000000000000000000000000000000002',
  '0xSYBIL0000000000000000000000000000000003',
  '0xSYBIL0000000000000000000000000000000004',
  '0xSYBIL0000000000000000000000000000000005',
  '0xORGANIC00000000000000000000000000000001',
  '0xORGANIC00000000000000000000000000000002',
];
const DEMO_TEXT = DEMO_ADDRESSES.join('\n');

const MAX_SCORE = 150;

// ---- Helpers ----

function shortAddr(a: string): string {
  return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-4)}` : a;
}

const BAND_LABEL: Record<Band, string> = { low: 'Low', medium: 'Medium', high: 'High' };

function parseAddresses(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

// Top risk drivers: non-zero signals, strongest first. Positive points = risk,
// negative = organic indicator (e.g. CEX-funded) — rendered distinctly, not as a flag.
function topSignals(signals: RiskSignal[], n = 3): RiskSignal[] {
  return signals
    .filter((s) => s.points !== 0)
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
    .slice(0, n);
}

function fmtPoints(p: number): string {
  return p > 0 ? `+${p}` : `${p}`;
}

// ---- Component ----

export default function SybilDemo() {
  const [input, setInput] = useState(DEMO_TEXT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  async function runAnalysis(addresses: string[]) {
    if (addresses.length === 0) {
      setError('Enter at least one address (one per line).');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Relative URL — same origin, no CORS, no env var.
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ addresses }),
      });
      const data = (await res.json()) as AnalyzeResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setResult(data as AnalyzeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // Auto-run the planted demo set on first mount so the page arrives "live".
  useEffect(() => {
    runAnalysis(DEMO_ADDRESSES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runAnalysis(parseAddresses(input));
  }

  const sybilCount = result?.reports.filter((r) => r.band === 'high').length ?? 0;

  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">Sybil Detection Engine</h2>
          <p className="lead">
            Explainable, keyless sybil scoring. Eight transparent signals (wallet age, shared
            funder, batch timing, behavioral repetition, gas similarity, inter-wallet transfers,
            CEX funding) yield a <strong>risk band</strong> per wallet, then union-find clustering
            groups coordinated farms. Every score shows its work.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/api/analyze</span>
            </div>
            <div className="demo-body">
              <form onSubmit={handleSubmit} className="sybil-form">
                <label htmlFor="addresses">Wallet addresses (one per line)</label>
                <textarea
                  id="addresses"
                  className="form-control sybil-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={8}
                  spellCheck={false}
                />
                <div className="sybil-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Analyzing…' : 'Analyze wallets'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={loading}
                    onClick={() => {
                      setInput(DEMO_TEXT);
                      runAnalysis(DEMO_ADDRESSES);
                    }}
                  >
                    Reset demo set
                  </button>
                </div>
              </form>

              {loading && <p className="status-msg status-loading">Scoring wallets…</p>}
              {error && <p className="status-msg status-error">{error}</p>}

              {result && (
                <>
                  <p className="routes-meta">
                    {result.reports.length} wallets · {sybilCount} high-risk · {result.clusters.length}{' '}
                    cluster{result.clusters.length === 1 ? '' : 's'} detected
                  </p>
                  <table className="routes-table">
                    <thead>
                      <tr>
                        <th>Wallet</th>
                        <th>Risk</th>
                        <th>Score</th>
                        <th>Top signals</th>
                        <th>Cluster</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.reports.map((r) => (
                        <tr key={r.address}>
                          <td className="mono-cell" title={r.address}>{shortAddr(r.address)}</td>
                          <td>
                            <span className={`band-badge band-${r.band}`}>{BAND_LABEL[r.band]}</span>
                          </td>
                          <td className="score-cell">{r.score}<span className="score-max">/{MAX_SCORE}</span></td>
                          <td className="signal-cell">
                            {topSignals(r.signals).map((s) => (
                              <span
                                key={s.name}
                                className={`sig-chip ${s.points < 0 ? 'sig-organic' : 'sig-risk'}`}
                                title={s.note}
                              >
                                {s.name} {fmtPoints(s.points)}
                              </span>
                            ))}
                          </td>
                          <td>{r.clusterId !== null ? `#${r.clusterId}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {result.clusters.length > 0 && (
                    <div className="cluster-summary">
                      <h3 className="cluster-title">Coordinated clusters</h3>
                      {result.clusters.map((c) => (
                        <p key={c.clusterId} className="cluster-row">
                          <span className={`band-badge band-${c.maxBand}`}>{BAND_LABEL[c.maxBand]}</span>
                          <strong>Cluster #{c.clusterId}</strong> · {c.addresses.length} wallets ·
                          avg score {c.avgScore}/{MAX_SCORE}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
