// RAG Alpha Aggregator — Workers-safe TypeScript.
// Keyless, offline-first retrieval-augmented classifier.
// Pure, no Node APIs, no network.

// ---- Types ----

export interface FeedItem {
  id: string;
  author: string;
  text: string;
}

export interface Opportunity {
  id: string;
  project: string;
  chain: string;
  kind: string;
  confidence: number;
  band: 'low' | 'medium' | 'high';
  stepsToQualify: string[];
  sourceItemIds: string[];
  mode: 'rag';
}

// ---- Constants ----

export const MAX_ITEMS = 50;

const AIRDROP_KEYWORDS = [
  'airdrop',
  'incentivized testnet',
  'points',
  'snapshot',
  'claim',
  'testnet',
  'tge',
  'eligibility',
  'eligible',
  'quest',
  'mint',
] as const;

// ---- Demo feed ----

export const DEMO_FEED: FeedItem[] = [
  // genuine airdrop signals
  { id: 'demo-0', author: '@zksync',     text: 'Incentivized testnet is LIVE on zkSync. Bridge to testnet, swap, and provide liquidity to qualify for the upcoming points program. Snapshot date TBA.' },
  { id: 'demo-1', author: '@LayerZero',  text: 'LayerZero points program now tracking on-chain activity across Arbitrum and Base. Complete bridge transactions to accrue points ahead of TGE.' },
  { id: 'demo-2', author: '@Scroll_ZKP', text: 'Scroll testnet quests are open. Mint the genesis NFT and interact with the canvas before the March 30 snapshot to be eligible.' },
  { id: 'demo-3', author: '@berachain',  text: 'Berachain Artio testnet: stake BERA, vote in governance. Eligibility snapshot for the airdrop closes end of month.' },
  { id: 'demo-4', author: '@taikoxyz',   text: 'Claim is LIVE: eligible Taiko testnet participants can now claim their TAIKO allocation at the official portal.' },
  // noise — none of the airdrop keywords
  { id: 'demo-5', author: '@cryptobro',  text: 'gm everyone, what a beautiful day to hold. wagmi 🚀' },
  { id: 'demo-6', author: '@news',       text: 'Bitcoin breaks $90k as ETF inflows surge. Analysts remain bullish on Q3.' },
  { id: 'demo-7', author: '@scamcoin',   text: 'BUY $MOON NOW 1000x guaranteed!!! presale ends soon dont miss out' },
  { id: 'demo-8', author: '@devlife',    text: 'spent all day debugging a websocket reconnect bug. send coffee.' },
  { id: 'demo-9', author: '@nftfan',     text: 'floor price on my favorite collection just doubled. lfg' },
];

// ---- parseFeed ----

/**
 * Parse a raw text block into FeedItems.
 * Each non-empty line: "@handle: rest" → {author:'@handle', text:'rest'}
 * else → {author:'@anon', text:line}. Capped at MAX_ITEMS.
 */
export function parseFeed(text: string): FeedItem[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_ITEMS)
    .map((line, i) => {
      const m = line.match(/^(@\S+):\s*(.*)/);
      if (m) {
        return { id: `parsed-${i}`, author: m[1], text: m[2] };
      }
      return { id: `parsed-${i}`, author: '@anon', text: line };
    });
}

// ---- Vector / retrieval ----

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function buildVocab(texts: string[]): string[] {
  const set = new Set<string>();
  for (const t of texts) for (const tok of tokenize(t)) set.add(tok);
  return [...set];
}

function vectorize(text: string, vocab: string[]): number[] {
  const tokens = tokenize(text);
  const freq: Record<string, number> = {};
  for (const tok of tokens) freq[tok] = (freq[tok] ?? 0) + 1;
  return vocab.map((term) => freq[term] ?? 0);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function retrieve(queryText: string, corpus: FeedItem[], k = 3): { item: FeedItem; score: number }[] {
  if (corpus.length === 0) return [];
  const allTexts = [queryText, ...corpus.map((c) => c.text)];
  const vocab = buildVocab(allTexts);
  const queryVec = vectorize(queryText, vocab);
  const scored = corpus.map((item) => ({ item, score: cosineSimilarity(queryVec, vectorize(item.text, vocab)) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ---- Deduplication ----

function dedupe(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  const out: FeedItem[] = [];
  for (const item of items) {
    const key = `${item.author}::${item.text}`;
    if (!seen.has(key)) { seen.add(key); out.push(item); }
  }
  return out;
}

// ---- Classification helpers ----

function deriveProject(author: string): string {
  return author.replace(/^@/, '').toLowerCase();
}

function deriveChain(textLower: string, authorLower: string): string {
  if (authorLower.includes('zksync')    || textLower.includes('zksync'))    return 'zkSync';
  if (authorLower.includes('layerzero') || textLower.includes('layerzero')) return 'multi-chain';
  if (authorLower.includes('scroll')    || textLower.includes('scroll'))    return 'Scroll';
  if (authorLower.includes('bera')      || textLower.includes('berachain')) return 'Berachain';
  if (authorLower.includes('taiko')     || textLower.includes('taiko'))     return 'Taiko';
  return 'unknown';
}

function deriveKind(textLower: string): string {
  if (textLower.includes('claim'))                                               return 'claim-live';
  if (textLower.includes('incentivized testnet') || textLower.includes('testnet')) return 'incentivized-testnet';
  if (textLower.includes('points') || textLower.includes('tge'))               return 'points';
  if (textLower.includes('snapshot'))                                            return 'snapshot';
  if (textLower.includes('quest')  || textLower.includes('mint'))               return 'snapshot';
  return 'unknown';
}

function deriveSteps(textLower: string): string[] {
  const steps: string[] = [];
  if (textLower.includes('bridge'))                                      steps.push('Bridge assets to the network');
  if (textLower.includes('swap'))                                        steps.push('Perform swaps on the testnet');
  if (textLower.includes('liquidity'))                                   steps.push('Provide liquidity');
  if (textLower.includes('stake'))                                       steps.push('Stake tokens');
  if (textLower.includes('governance') || textLower.includes('vote'))   steps.push('Vote in governance');
  if (textLower.includes('mint'))                                        steps.push('Mint the genesis NFT / specified asset');
  if (textLower.includes('quest'))                                       steps.push('Complete on-chain quests');
  if (textLower.includes('snapshot'))                                    steps.push('Ensure wallet activity is complete before the snapshot date');
  if (textLower.includes('claim'))                                       steps.push('Visit the official portal to claim your allocation');
  if (steps.length === 0)                                                steps.push('Monitor official channels for qualifying actions');
  return steps;
}

// ---- relevanceBand ----

export function relevanceBand(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.27) return 'high';
  if (confidence >= 0.18) return 'medium';
  return 'low';
}

// ---- Classify ----

function classify(items: FeedItem[]): Opportunity[] {
  const opportunities: Opportunity[] = [];

  for (const item of items) {
    const textLower = item.text.toLowerCase();

    const matchedKeywords = AIRDROP_KEYWORDS.filter((kw) => textLower.includes(kw));
    if (matchedKeywords.length === 0) continue;

    const corpus = items.filter((c) => c.id !== item.id);
    const neighbors = retrieve(item.text, corpus, 3);

    const contextBoost = neighbors.reduce((acc, { item: neighbor, score }) => {
      const nLower = neighbor.text.toLowerCase();
      const nMatches = AIRDROP_KEYWORDS.filter((kw) => nLower.includes(kw)).length;
      return acc + (nMatches > 0 ? score * 0.05 : 0);
    }, 0);

    const baseConfidence = matchedKeywords.length / AIRDROP_KEYWORDS.length;
    const confidence = Math.round(Math.min(1, baseConfidence + contextBoost) * 1000) / 1000;
    const band = relevanceBand(confidence);

    const authorLower = item.author.toLowerCase();

    const opp: Opportunity = {
      id:             item.id,
      project:        deriveProject(item.author),
      chain:          deriveChain(textLower, authorLower),
      kind:           deriveKind(textLower),
      confidence,
      band,
      stepsToQualify: deriveSteps(textLower),
      sourceItemIds:  [item.id],
      mode:           'rag' as const,
    };

    opportunities.push(opp);
  }

  // Sort by confidence descending
  opportunities.sort((a, b) => b.confidence - a.confidence);
  return opportunities;
}

// ---- Public orchestrator ----

/**
 * Run the full pipeline: dedupe → classify → sort.
 * Defaults to DEMO_FEED when no items are provided.
 */
export function runPipeline(items?: FeedItem[]): Opportunity[] {
  const feed = items ?? DEMO_FEED;
  const deduped = dedupe(feed);
  return classify(deduped);
}
