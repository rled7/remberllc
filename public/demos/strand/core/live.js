// Live routing (Phase 2): segment a conversation INCREMENTALLY as each message
// arrives, instead of batch-processing a finished transcript. Past assignments are
// frozen (stable UX — old messages don't jump strands); only the new message is
// routed: to the most-similar existing strand, or — if nothing is similar enough —
// into a NEW strand, which surfaces as a "new context?" signal.
//
//   const live = new LiveSegmenter();
//   const r = live.add({ role: "user", text: "..." });
//   // r = { index, strandId, isNew, score, label }
//
// Uses a running TF-IDF: document frequencies update as messages arrive, so the
// vocabulary model grows with the conversation. Centroids accumulate per-message
// vectors (a small idf-drift simplification that's fine for routing decisions).
import { tokenize } from "./tokenize.js";
import { termFreq, addInto, cosine } from "./vectorize.js";

export class LiveSegmenter {
  constructor({ threshold = 0.05 } = {}) {
    this.threshold = threshold;
    this.df = new Map();      // term -> document frequency
    this.N = 0;               // documents seen
    this.messages = [];
    this.strands = [];        // { id, centroid, messageIndices, label }
  }

  _idf(term) { return Math.log((this.N + 1) / ((this.df.get(term) || 0) + 1)) + 1; }

  _vec(tokens) {
    const tf = termFreq(tokens), v = new Map();
    for (const [t, f] of tf) v.set(t, f * this._idf(t));
    return v;
  }

  _label(centroid, n = 3) {
    return [...centroid.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
  }

  add(message) {
    const index = this.messages.length;
    this.messages.push(message);
    const tokens = tokenize(message.text);

    // Update the running document-frequency model BEFORE vectorizing.
    this.N++;
    for (const t of new Set(tokens)) this.df.set(t, (this.df.get(t) || 0) + 1);

    // Low-signal message ("ok", "thanks") → stick with the current strand.
    if (tokens.length === 0 && this.strands.length) {
      const s = this.strands[this.strands.length - 1];
      s.messageIndices.push(index);
      return { index, strandId: s.id, isNew: false, score: 1, label: s.label };
    }

    const v = this._vec(tokens);
    let best = -1, bestSim = 0;
    for (const s of this.strands) {
      const sim = cosine(v, s.centroid);
      if (sim > bestSim) { bestSim = sim; best = s.id; }
    }

    let strand, isNew;
    if (best >= 0 && bestSim >= this.threshold) {
      strand = this.strands[best]; isNew = false;
      addInto(strand.centroid, v);
      strand.messageIndices.push(index);
    } else {
      strand = { id: this.strands.length, centroid: new Map(v), messageIndices: [index], label: [] };
      this.strands.push(strand); isNew = true;
    }
    strand.label = this._label(strand.centroid);
    return { index, strandId: strand.id, isNew, score: isNew ? 0 : bestSim, label: strand.label };
  }
}
