// Phase 4 — cross-conversation memory. Store the strands of MANY conversations and
// search across all of them ("find everything about X, in any chat I've ever had").
// Storage-agnostic: serialize()/deserialize() hand off to localStorage, a file, etc.
//
// Retrieval treats each STRAND as a document and computes IDF across the whole store,
// so a query is ranked against every strand of every conversation with consistent
// term weighting.
import { tokenize } from "./tokenize.js";
import { termFreq, cosine } from "./vectorize.js";
import { segment } from "./segment.js";

export class StrandStore {
  constructor() { this.conversations = []; } // [{ id, title, strands:[{label, tf:[[t,f]], messageIndices, snippet}] , messages }]

  // Segment a conversation and fold its strands into the store.
  addConversation(id, messages, title = id) {
    const { strands } = segment(messages);
    const stored = strands.map(s => {
      const tf = new Map();
      for (const i of s.messageIndices) for (const [t, f] of termFreq(tokenize(messages[i].text))) tf.set(t, (tf.get(t) || 0) + f);
      return { label: s.label, messageIndices: s.messageIndices, tf: [...tf], snippet: messages[s.messageIndices[0]].text.slice(0, 120) };
    });
    this.conversations.push({ id, title, strands: stored, messages });
    return stored.length;
  }

  _allStrands() {
    const out = [];
    for (const c of this.conversations) c.strands.forEach((s, si) => out.push({ convId: c.id, title: c.title, strandIndex: si, ...s }));
    return out;
  }

  // IDF across all strands (each strand = one document).
  _idf(allStrands) {
    const df = new Map(), N = allStrands.length;
    for (const s of allStrands) for (const [t] of s.tf) df.set(t, (df.get(t) || 0) + 1);
    const idf = new Map();
    for (const [t, d] of df) idf.set(t, Math.log((N + 1) / (d + 1)) + 1);
    return idf;
  }

  _vec(tfEntries, idf) {
    const v = new Map();
    for (const [t, f] of tfEntries) v.set(t, f * (idf.get(t) || 0));
    return v;
  }

  // Rank every strand in the store against a query.
  search(query, { limit = 10 } = {}) {
    const all = this._allStrands();
    if (!all.length) return [];
    const idf = this._idf(all);
    const qv = this._vec(termFreq(tokenize(query)), idf);
    return all
      .map(s => ({ convId: s.convId, title: s.title, label: s.label, snippet: s.snippet, score: cosine(qv, this._vec(s.tf, idf)) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  stats() {
    return { conversations: this.conversations.length, strands: this._allStrands().length };
  }

  serialize() { return JSON.stringify({ v: 1, conversations: this.conversations }); }

  static deserialize(json) {
    const store = new StrandStore();
    const data = typeof json === "string" ? JSON.parse(json) : json;
    store.conversations = (data?.conversations) || [];
    return store;
  }
}
