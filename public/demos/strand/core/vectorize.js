// TF-IDF vectorization + cosine similarity over tokenized messages. Pure JS.
// Vectors are sparse maps { term -> weight }. This is the similarity backbone the
// segmenter and retriever share.
import { tokenize } from "./tokenize.js";

// Term frequency map for one document's tokens.
export function termFreq(tokens) {
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  return tf;
}

// Inverse document frequency across a corpus of token arrays.
export function idf(docsTokens) {
  const df = new Map(), N = docsTokens.length;
  for (const toks of docsTokens) {
    for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
  }
  const out = new Map();
  for (const [t, d] of df) out.set(t, Math.log((N + 1) / (d + 1)) + 1); // smoothed idf
  return out;
}

// TF-IDF vector (sparse map) for one document, given a precomputed idf.
export function tfidf(tokens, idfMap) {
  const tf = termFreq(tokens), vec = new Map();
  for (const [t, f] of tf) vec.set(t, f * (idfMap.get(t) || 0));
  return vec;
}

export function dot(a, b) {
  let s = 0;
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const [t, w] of small) { const w2 = big.get(t); if (w2) s += w * w2; }
  return s;
}

export function norm(v) {
  let s = 0;
  for (const w of v.values()) s += w * w;
  return Math.sqrt(s);
}

export function cosine(a, b) {
  const na = norm(a), nb = norm(b);
  if (na === 0 || nb === 0) return 0;
  return dot(a, b) / (na * nb);
}

// Add vector b into accumulator a (in place); used to grow strand centroids.
export function addInto(a, b) {
  for (const [t, w] of b) a.set(t, (a.get(t) || 0) + w);
  return a;
}

// Build per-message tokens + tf-idf vectors for a whole conversation.
export function vectorizeMessages(messages) {
  const toks = messages.map(m => tokenize(m.text));
  const idfMap = idf(toks);
  const vecs = toks.map(t => tfidf(t, idfMap));
  return { toks, idfMap, vecs };
}
