import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// ---- Types (mirror lib/ragAlpha.ts; inlined so the engine stays out of the
// client bundle — same pattern as SybilDemo) ----

type Band = 'low' | 'medium' | 'high';

interface Opportunity {
  id: string;
  project: string;
  chain: string;
  kind: string;
  confidence: number;
  band: Band;
  stepsToQualify: string[];
  sourceItemIds: string[];
  mode: 'rag';
}

interface OpportunitiesResult {
  opportunities: Opportunity[];
}

// The 10 demo posts (5 signals + 5 noise) — textarea prefill, sent to /api/opportunities.
// Format: "@handle: text" (matches parseFeed on server, though POST sends structured JSON).
const DEMO_LINES = [
  '@zksync: Incentivized testnet is LIVE on zkSync. Bridge to testnet, swap, and provide liquidity to qualify for the upcoming points program. Snapshot date TBA.',
  '@LayerZero: LayerZero points program now tracking on-chain activity across Arbitrum and Base. Complete bridge transactions to accrue points ahead of TGE.',
  '@Scroll_ZKP: Scroll testnet quests are open. Mint the genesis NFT and interact with the canvas before the March 30 snapshot to be eligible.',
  '@berachain: Berachain Artio testnet: stake BERA, vote in governance. Eligibility snapshot for the airdrop closes end of month.',
  '@taikoxyz: Claim is LIVE: eligible Taiko testnet participants can now claim their TAIKO allocation at the official portal.',
  '@cryptobro: gm everyone, what a beautiful day to hold. wagmi 🚀',
  '@news: Bitcoin breaks $90k as ETF inflows surge. Analysts remain bullish on Q3.',
  '@scamcoin: BUY $MOON NOW 1000x guaranteed!!! presale ends soon dont miss out',
  '@devlife: spent all day debugging a websocket reconnect bug. send coffee.',
  '@nftfan: floor price on my favorite collection just doubled. lfg',
];
const DEMO_TEXT = DEMO_LINES.join('\n');

const BAND_LABEL: Record<Band, string> = { low: 'Low signal', medium: 'Medium signal', high: 'High signal' };

// Parse "@handle: rest" lines into {author, text} objects for POST body.
function parseLines(text: string): { author: string; text: string }[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(@\S+):\s*(.*)/);
      if (m) return { author: m[1], text: m[2] };
      return { author: '@anon', text: line };
    });
}

function KindBadge({ kind }: { kind: string }) {
  const cls =
    kind === 'claim-live'         ? 'kind-badge kind-claim'    :
    kind === 'incentivized-testnet' ? 'kind-badge kind-testnet'  :
    kind === 'points'             ? 'kind-badge kind-points'   :
    kind === 'snapshot'           ? 'kind-badge kind-snapshot' :
                                    'kind-badge kind-unknown';
  return <span className={cls}>{kind}</span>;
}

// ---- Component ----

export default function RagDemo() {
  const [input, setInput]   = useState(DEMO_TEXT);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [result, setResult] = useState<OpportunitiesResult | null>(null);

  async function runPipeline(posts: { author: string; text: string }[]) {
    if (posts.length === 0) {
      setError('Enter at least one feed post (one per line).');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ posts }),
      });
      const data = (await res.json()) as OpportunitiesResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setResult(data as OpportunitiesResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // Auto-run the demo feed on first mount.
  useEffect(() => {
    runPipeline(parseLines(DEMO_TEXT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runPipeline(parseLines(input));
  }

  const totalPosts = input.split('\n').map((l) => l.trim()).filter(Boolean).length;
  const oppCount   = result?.opportunities.length ?? 0;

  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">RAG Alpha Aggregator</h2>
          <p className="lead">
            A keyless, offline-first retrieval-augmented classifier that surfaces airdrop
            opportunities from noisy social feeds. Bag-of-words cosine retrieval provides
            context boost from similar posts; keyword rules score and filter signals; the pipeline
            returns ranked opportunities with steps to qualify — no API key required.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/api/opportunities</span>
            </div>
            <div className="demo-body">
              <form onSubmit={handleSubmit} className="sybil-form">
                <label htmlFor="feed-posts">Feed posts (one per line, format: @handle: text)</label>
                <textarea
                  id="feed-posts"
                  className="form-control sybil-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={10}
                  spellCheck={false}
                />
                <div className="sybil-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Classifying…' : 'Run pipeline'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={loading}
                    onClick={() => {
                      setInput(DEMO_TEXT);
                      runPipeline(parseLines(DEMO_TEXT));
                    }}
                  >
                    Reset demo set
                  </button>
                </div>
              </form>

              {loading && <p className="status-msg status-loading">Classifying feed…</p>}
              {error && <p className="status-msg status-error">{error}</p>}

              {result && (
                <>
                  <p className="routes-meta">
                    {oppCount} opportunit{oppCount === 1 ? 'y' : 'ies'} surfaced from {totalPosts} feed item{totalPosts === 1 ? '' : 's'}
                  </p>
                  {oppCount === 0 ? (
                    <p className="status-msg status-loading">No airdrop signals detected in this feed.</p>
                  ) : (
                    <table className="routes-table">
                      <thead>
                        <tr>
                          <th>Signal</th>
                          <th>Project</th>
                          <th>Chain</th>
                          <th>Kind</th>
                          <th>Confidence</th>
                          <th>Steps to qualify</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.opportunities.map((opp, rank) => (
                          <tr key={opp.id}>
                            <td>
                              <span className={`band-badge band-${opp.band}`}>
                                {BAND_LABEL[opp.band]}
                              </span>
                              <span className="opp-rank">#{rank + 1}</span>
                            </td>
                            <td className="mono-cell">{opp.project}</td>
                            <td>{opp.chain}</td>
                            <td><KindBadge kind={opp.kind} /></td>
                            <td className="opp-confidence">
                              <span className="score-cell">{(opp.confidence * 100).toFixed(1)}</span>
                              <span className="score-max">%</span>
                            </td>
                            <td>
                              <ul className="steps-list">
                                {opp.stepsToQualify.map((step) => (
                                  <li key={step}>{step}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
