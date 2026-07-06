// Sybil-detection engine — self-contained port of sybil-detection-engine/src
// (types + mock adapter w/ synthesis + explainable scoring + union-find clustering),
// adapted for a Cloudflare Pages Function. Pure, keyless, no network.

// ---- Types ----

export interface WalletFeatures {
  address: string;
  firstTxTs: number;
  txCount: number;
  funders: string[];
  fundedTs: number[];
  gasPrices: number[];
  actionSeq: string[];
  transfersToAnalyzed: string[];
}

export interface RiskSignal {
  name: string;
  value: number | string;
  points: number;
  note: string;
}

export interface WalletReport {
  address: string;
  score: number;
  band: 'low' | 'medium' | 'high';
  signals: RiskSignal[];
  clusterId: number | null;
}

export interface ClusterSummary {
  clusterId: number;
  addresses: string[];
  maxBand: 'low' | 'medium' | 'high';
  avgScore: number;
}

export interface AnalyzeResult {
  reports: WalletReport[];
  clusters: ClusterSummary[];
}

// ---- Mock fixtures + synthesizer ----

const SYBIL_FUNDER = '0xFARMER0000000000000000000000000000000001';
const NOW = Math.floor(Date.now() / 1000);
const SYBIL_BASE = NOW - 7 * 86400;
const SYBIL_SEQ = ['swap', 'stake', 'claim', 'swap'];
const SYBIL_GAS = [22, 22, 23, 22];

const SYBIL_ADDRS = [
  '0xSYBIL0000000000000000000000000000000001',
  '0xSYBIL0000000000000000000000000000000002',
  '0xSYBIL0000000000000000000000000000000003',
  '0xSYBIL0000000000000000000000000000000004',
  '0xSYBIL0000000000000000000000000000000005',
];
const ORGANIC_ADDRS = [
  '0xORGANIC00000000000000000000000000000001',
  '0xORGANIC00000000000000000000000000000002',
];

/** The 7 demo addresses (5 planted sybils + 2 organics) for the "Load demo" button. */
export const DEMO_ADDRESSES = [...SYBIL_ADDRS, ...ORGANIC_ADDRS];

/** Temporary diagnostic: raw clock values to root-cause a live wallet-age offset bug. Remove once resolved. */
export function _debugClock() {
  return { moduleScopeNOW: NOW, requestTimeNowSec: Math.floor(Date.now() / 1000), sybilBase: SYBIL_BASE, sybil0FirstTxTs: SYBIL_BASE + 10 };
}

const FIXTURES: Record<string, WalletFeatures> = {
  [SYBIL_ADDRS[0]]: { address: SYBIL_ADDRS[0], firstTxTs: SYBIL_BASE + 10, txCount: 5, funders: [SYBIL_FUNDER], fundedTs: [SYBIL_BASE + 10], gasPrices: SYBIL_GAS, actionSeq: SYBIL_SEQ, transfersToAnalyzed: [SYBIL_ADDRS[1], SYBIL_ADDRS[2]] },
  [SYBIL_ADDRS[1]]: { address: SYBIL_ADDRS[1], firstTxTs: SYBIL_BASE + 120, txCount: 5, funders: [SYBIL_FUNDER], fundedTs: [SYBIL_BASE + 120], gasPrices: SYBIL_GAS, actionSeq: SYBIL_SEQ, transfersToAnalyzed: [SYBIL_ADDRS[0], SYBIL_ADDRS[3]] },
  [SYBIL_ADDRS[2]]: { address: SYBIL_ADDRS[2], firstTxTs: SYBIL_BASE + 240, txCount: 6, funders: [SYBIL_FUNDER], fundedTs: [SYBIL_BASE + 240], gasPrices: [22, 23, 22, 22], actionSeq: SYBIL_SEQ, transfersToAnalyzed: [SYBIL_ADDRS[4]] },
  [SYBIL_ADDRS[3]]: { address: SYBIL_ADDRS[3], firstTxTs: SYBIL_BASE + 360, txCount: 5, funders: [SYBIL_FUNDER], fundedTs: [SYBIL_BASE + 360], gasPrices: SYBIL_GAS, actionSeq: SYBIL_SEQ, transfersToAnalyzed: [SYBIL_ADDRS[1], SYBIL_ADDRS[4]] },
  [SYBIL_ADDRS[4]]: { address: SYBIL_ADDRS[4], firstTxTs: SYBIL_BASE + 480, txCount: 5, funders: [SYBIL_FUNDER], fundedTs: [SYBIL_BASE + 480], gasPrices: SYBIL_GAS, actionSeq: SYBIL_SEQ, transfersToAnalyzed: [SYBIL_ADDRS[2], SYBIL_ADDRS[3]] },
  [ORGANIC_ADDRS[0]]: { address: ORGANIC_ADDRS[0], firstTxTs: NOW - 730 * 86400, txCount: 248, funders: ['0xCEX_COINBASE_HOT_WALLET_0000000000000001'], fundedTs: [NOW - 730 * 86400], gasPrices: [18, 25, 31, 14, 22, 40, 12, 19], actionSeq: ['swap', 'lp', 'vote', 'claim', 'bridge', 'swap', 'unstake'], transfersToAnalyzed: [] },
  [ORGANIC_ADDRS[1]]: { address: ORGANIC_ADDRS[1], firstTxTs: NOW - 400 * 86400, txCount: 87, funders: ['0xCEX_BINANCE_HOT_WALLET_00000000000000001'], fundedTs: [NOW - 400 * 86400], gasPrices: [20, 35, 28, 15, 42, 18, 30, 25, 22], actionSeq: ['bridge', 'swap', 'stake', 'claim', 'vote', 'lp'], transfersToAnalyzed: [] },
};

const FIXTURE_LOOKUP: Record<string, WalletFeatures> = Object.fromEntries(
  Object.entries(FIXTURES).map(([k, v]) => [k.toLowerCase(), v])
);

function fnv1a(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  return h >>> 0;
}
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
const SYNTH_ACTIONS = ['swap', 'lp', 'stake', 'unstake', 'vote', 'claim', 'bridge', 'mint'];

/** Deterministic synthesized features for any unknown address (demo never breaks). */
function synthesize(address: string): WalletFeatures {
  const hash = fnv1a(address.toLowerCase());
  const rand = lcg(hash);
  const ageDays = 31 + Math.floor(rand() * 900);
  const txCount = 15 + Math.floor(rand() * 400);
  const gasPrices = Array.from({ length: 4 + Math.floor(rand() * 6) }, () => 12 + Math.floor(rand() * 40));
  const actionSeq = Array.from({ length: 3 + Math.floor(rand() * 5) }, () => SYNTH_ACTIONS[Math.floor(rand() * SYNTH_ACTIONS.length)]);
  const funder = '0xUNKNOWN' + hash.toString(16).padStart(8, '0').repeat(4).slice(0, 32);
  const firstTxTs = NOW - ageDays * 86400;
  return { address, firstTxTs, txCount, funders: [funder], fundedTs: [firstTxTs], gasPrices, actionSeq, transfersToAnalyzed: [] };
}

function getFeatures(address: string): WalletFeatures {
  const fixture = FIXTURE_LOOKUP[address.toLowerCase()];
  return fixture ? { ...fixture, address } : synthesize(address);
}

// ---- Scoring ----

const LOW_MAX = 29, MEDIUM_MAX = 59, MAX_SCORE = 150, MIN_SCORE = 0;
function toBand(s: number): WalletReport['band'] { return s <= LOW_MAX ? 'low' : s <= MEDIUM_MAX ? 'medium' : 'high'; }

interface Ctx { funderMap: Map<string, string[]>; actionSeqMap: Map<string, string>; }
function buildContext(all: WalletFeatures[]): Ctx {
  const funderMap = new Map<string, string[]>();
  const actionSeqMap = new Map<string, string>();
  for (const f of all) {
    actionSeqMap.set(f.address, f.actionSeq.join(','));
    for (const funder of f.funders) {
      const list = funderMap.get(funder) ?? [];
      list.push(f.address);
      funderMap.set(funder, list);
    }
  }
  return { funderMap, actionSeqMap };
}

const CEX_PATTERNS = ['0xcex_', '0xbinance', '0xcoinbase', '0xkraken', '0xokex', '0xhuobi'];

function scoreWallet(f: WalletFeatures, ctx: Ctx, all: WalletFeatures[], nowTs: number): Omit<WalletReport, 'clusterId'> {
  const signals: RiskSignal[] = [];

  // S1 wallet age
  const ageDays = (nowTs - f.firstTxTs) / 86400;
  const isNew = ageDays < 30;
  signals.push({ name: 'wallet_age_new', value: `${ageDays.toFixed(1)} days`, points: isNew ? 15 : 0,
    note: isNew ? `Wallet is only ${ageDays.toFixed(1)} days old (<30d). New wallets often indicate farming.` : `Wallet is ${ageDays.toFixed(1)} days old — established history.` });

  // S2 tx count
  const lowTx = f.txCount < 10;
  signals.push({ name: 'tx_count_low', value: f.txCount, points: lowTx ? 10 : 0,
    note: lowTx ? `Only ${f.txCount} transactions — commonly a wallet made just to qualify.` : `${f.txCount} transactions — genuine activity.` });

  // S3 shared funder
  let maxShared = 0, hotFunder = '';
  for (const funder of f.funders) {
    const sib = (ctx.funderMap.get(funder) ?? []).filter((a) => a !== f.address);
    if (sib.length >= 3 && sib.length > maxShared) { maxShared = sib.length; hotFunder = funder; }
  }
  const sharedFlag = maxShared >= 3;
  signals.push({ name: 'shared_funder', value: sharedFlag ? `${hotFunder} (${maxShared} others)` : 'none', points: sharedFlag ? 30 : 0,
    note: sharedFlag ? `Funder ${hotFunder.slice(0, 10)}… also funded ${maxShared} other analyzed wallets. Strong sybil indicator.` : 'No funder also funded 3+ other analyzed wallets.' });

  // S4 batch timing
  let batch = false, window = '';
  for (const funder of f.funders) {
    const sibAddrs = (ctx.funderMap.get(funder) ?? []).filter((a) => a !== f.address);
    const sibs = all.filter((sf) => sibAddrs.includes(sf.address));
    for (const myTs of f.fundedTs) for (const s of sibs) for (const sTs of s.fundedTs) {
      if (Math.abs(myTs - sTs) <= 3600) { batch = true; window = `${(Math.abs(myTs - sTs) / 60).toFixed(1)}m from ${s.address.slice(0, 10)}…`; break; }
    }
    if (batch) break;
  }
  signals.push({ name: 'batch_funded_timing', value: batch ? window : 'no batch', points: batch ? 25 : 0,
    note: batch ? `Funded within 60 minutes of another same-funder wallet (${window}). Suggests coordinated batch creation.` : 'Funding timing not suspiciously close to other wallets.' });

  // S5 behavioral repetition
  const mySeq = f.actionSeq.join(',');
  let matches = 0;
  for (const [addr, seq] of ctx.actionSeqMap.entries()) if (addr !== f.address && seq === mySeq) matches++;
  const repFlag = matches >= 2;
  signals.push({ name: 'behavioral_repetition', value: `${matches} exact matches`, points: repFlag ? 25 : 0,
    note: repFlag ? `Action sequence [${f.actionSeq.join(', ')}] shared by ${matches} other wallets — scripted farming.` : `Action sequence unique or shared by ≤1 wallet.` });

  // S6 gas similarity
  const related = new Set<string>();
  for (const funder of f.funders) for (const addr of ctx.funderMap.get(funder) ?? []) if (addr !== f.address) related.add(addr);
  let gasPts = 0, gasVal = 'no related wallets';
  if (related.size > 0 && f.gasPrices.length > 0) {
    const myMean = f.gasPrices.reduce((a, b) => a + b, 0) / f.gasPrices.length;
    const relGas: number[] = [];
    for (const rf of all) if (related.has(rf.address)) relGas.push(...rf.gasPrices);
    if (relGas.length > 0) {
      const groupMean = relGas.reduce((a, b) => a + b, 0) / relGas.length;
      const dev = Math.abs(myMean - groupMean) / groupMean;
      gasPts = dev <= 0.15 ? 15 : 0;
      gasVal = `dev ${(dev * 100).toFixed(1)}%`;
    }
  }
  signals.push({ name: 'gas_similarity', value: gasVal, points: gasPts,
    note: gasPts > 0 ? `Gas within 15% of related wallets (${gasVal}) — script-coordinated.` : 'No suspicious gas similarity.' });

  // S7 inter-wallet transfers
  const hasT = f.transfersToAnalyzed.length > 0;
  signals.push({ name: 'inter_wallet_transfers', value: hasT ? f.transfersToAnalyzed.length : 0, points: hasT ? 30 : 0,
    note: hasT ? `Sent funds to ${f.transfersToAnalyzed.length} other analyzed wallet(s) — coordinated cluster.` : 'No direct transfers to other analyzed wallets.' });

  // S8 CEX funded
  const cex = f.funders.find((fn) => CEX_PATTERNS.some((p) => fn.toLowerCase().includes(p)));
  signals.push({ name: 'cex_funded', value: cex ?? 'none', points: cex ? -20 : 0,
    note: cex ? `Funded from ${cex} (known CEX hot wallet) — organic indicator, reduces risk.` : 'Not funded from a known CEX.' });

  const raw = signals.reduce((s, x) => s + x.points, 0);
  const finalScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, raw));
  return { address: f.address, score: finalScore, band: toBand(finalScore), signals };
}

// ---- Clustering (union-find) ----

function clusterWallets(all: WalletFeatures[]): { clusterIds: Map<string, number | null>; clusters: Map<number, string[]> } {
  const addrs = all.map((f) => f.address);
  const parent = new Map(addrs.map((k) => [k, k]));
  const find = (x: string): string => { let p = parent.get(x)!; if (p !== x) { p = find(p); parent.set(x, p); } return p; };
  const union = (a: string, b: string) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

  const set = new Set(addrs);
  const funderToWallets = new Map<string, string[]>();
  for (const f of all) for (const funder of f.funders) {
    const list = funderToWallets.get(funder) ?? []; list.push(f.address); funderToWallets.set(funder, list);
  }
  for (const wallets of funderToWallets.values()) for (let i = 1; i < wallets.length; i++) union(wallets[0], wallets[i]);
  for (const f of all) for (const t of f.transfersToAnalyzed) if (set.has(t)) union(f.address, t);

  const roots = new Map<string, string>();
  for (const a of addrs) roots.set(a, find(a));
  const size = new Map<string, number>();
  for (const r of roots.values()) size.set(r, (size.get(r) ?? 0) + 1);
  const rootToId = new Map<string, number>();
  let next = 1;
  for (const [r, sz] of size.entries()) if (sz > 1) rootToId.set(r, next++);

  const clusterIds = new Map<string, number | null>();
  const clusters = new Map<number, string[]>();
  for (const a of addrs) {
    const id = rootToId.get(roots.get(a)!) ?? null;
    clusterIds.set(a, id);
    if (id !== null) { const l = clusters.get(id) ?? []; l.push(a); clusters.set(id, l); }
  }
  return { clusterIds, clusters };
}

// ---- Input normalization ----

export const MAX_ADDRESSES = 100;
export function normalizeAddresses(addresses: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of addresses) {
    const addr = String(raw).trim();
    if (!addr) continue;
    const key = addr.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(addr);
    if (out.length >= MAX_ADDRESSES) break;
  }
  return out;
}

// ---- Public orchestrator ----

export function analyze(rawAddresses: string[]): AnalyzeResult {
  const addresses = normalizeAddresses(rawAddresses);
  if (addresses.length === 0) return { reports: [], clusters: [] };

  const all = addresses.map(getFeatures);
  const nowTs = Math.floor(Date.now() / 1000);
  const ctx = buildContext(all);
  const scored = all.map((f) => scoreWallet(f, ctx, all, nowTs));
  const { clusterIds, clusters: clusterMap } = clusterWallets(all);

  const reports: WalletReport[] = scored.map((r) => ({ ...r, clusterId: clusterIds.get(r.address) ?? null }));

  const BAND_ORDER = { low: 0, medium: 1, high: 2 } as const;
  const BAND_NAMES: WalletReport['band'][] = ['low', 'medium', 'high'];
  const clusters: ClusterSummary[] = [];
  for (const [clusterId, addrs] of clusterMap.entries()) {
    const members = reports.filter((r) => addrs.includes(r.address));
    const maxBandIdx = Math.max(...members.map((r) => BAND_ORDER[r.band]));
    const avgScore = Math.round(members.reduce((s, r) => s + r.score, 0) / members.length);
    clusters.push({ clusterId, addresses: addrs, maxBand: BAND_NAMES[maxBandIdx], avgScore });
  }
  return { reports, clusters };
}
