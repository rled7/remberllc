import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// ---- Types (mirrors backend RouteQuote) ----

type Chain = 'ethereum' | 'arbitrum' | 'optimism' | 'base' | 'polygon' | 'bsc';

interface FeeBreakdown {
  sourceGasUsd: number;
  destGasUsd: number;
  protocolFeeUsd: number;
}

interface RouteQuote {
  bridge: string;
  amountInUsd: number;
  amountOutUsd: number;
  amountOutToken: number;
  fees: FeeBreakdown;
  totalCostUsd: number;
  effectiveCostBps: number;
  etaSeconds: number;
  flagged: boolean;
}

interface RoutesResult {
  query: { fromChain: Chain; toChain: Chain; token: string; amount: number };
  routes: RouteQuote[];
  count: number;
}

// ---- Helpers ----

const CHAINS: Chain[] = ['ethereum', 'arbitrum', 'optimism', 'base', 'polygon', 'bsc'];

function fmt(n: number): string {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtEta(s: number): string {
  return s >= 60 ? `${Math.round(s / 60)}m` : `${s}s`;
}

// ---- Component ----

export default function BridgeDemo() {
  const [fromChain, setFromChain] = useState<Chain>('ethereum');
  const [toChain, setToChain] = useState<Chain>('arbitrum');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoutesResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        from: fromChain,
        to: toChain,
        token,
        amount,
      });
      // Relative URL — same origin, no CORS, no env var
      const res = await fetch(`/api/routes?${params}`);
      const data = (await res.json()) as RoutesResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setResult(data as RoutesResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">Cross-Chain Bridge Cost Optimizer</h2>
          <p className="lead">
            Ranks routes by <strong>net capital preserved</strong> after source gas + destination
            gas + protocol fee. Flags unreasonable fees as a QA signal.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/api/routes</span>
            </div>
            <div className="demo-body">
      <form onSubmit={handleSubmit} className="bridge-form">
        <div className="form-group">
          <label htmlFor="from-chain">From</label>
          <select
            id="from-chain"
            className="form-control"
            value={fromChain}
            onChange={(e) => setFromChain(e.target.value as Chain)}
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="to-chain">To</label>
          <select
            id="to-chain"
            className="form-control"
            value={toChain}
            onChange={(e) => setToChain(e.target.value as Chain)}
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="token">Token</label>
          <input
            id="token"
            className="form-control"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            className="form-control"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>&nbsp;</label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading…' : 'Find routes'}
          </button>
        </div>
      </form>

      {loading && <p className="status-msg status-loading">Fetching routes…</p>}

      {error && <p className="status-msg status-error">{error}</p>}

      {result && (
        <>
          <p className="routes-meta">
            {result.count} routes · amount in {fmt(result.routes[0]?.amountInUsd ?? 0)}
          </p>
          <table className="routes-table">
            <thead>
              <tr>
                <th>Bridge</th>
                <th>Net received</th>
                <th>Cost breakdown (3 layers)</th>
                <th>Eff. cost</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {result.routes.map((r, i) => (
                <tr key={r.bridge}>
                  <td>
                    {r.bridge}
                    {r.flagged && <span className="flag-badge">unreasonable fee</span>}
                  </td>
                  <td className={i === 0 ? 'td-best' : ''}>
                    {fmt(r.amountOutUsd)}
                    {i === 0 ? ' ★' : ''}
                  </td>
                  <td className="fee-detail">
                    src {fmt(r.fees.sourceGasUsd)} · dst {fmt(r.fees.destGasUsd)} · fee{' '}
                    {fmt(r.fees.protocolFeeUsd)}
                  </td>
                  <td>{(r.effectiveCostBps / 100).toFixed(3)}%</td>
                  <td>{fmtEta(r.etaSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
