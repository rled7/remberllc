// Segment a conversation into topic "strands" by online clustering over TF-IDF.
// Each message joins the most-similar existing strand if similarity ≥ threshold,
// otherwise it starts a new strand. Because assignment is to the best strand (not
// just the previous one), an interleaved topic that resurfaces later REJOINS its
// original strand — the "soft/overlapping, interleaved" behavior from the pitch.
import { vectorizeMessages, cosine, addInto } from "./vectorize.js";

function labelFor(centroid, n = 3) {
  return [...centroid.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
}

// messages: [{ role, text }]. Returns { strands, order }.
// strands: [{ id, label, messageIndices, centroid }]; order: strand id per message.
// threshold tuned empirically (0.05): on real, vocabulary-varied threads it groups
// same-topic messages without over-merging distinct topics (whose TF-IDF cosine is
// ~0 and stays separate). Raise it for stricter splitting, lower it to merge more.
export function segment(messages, { threshold = 0.05 } = {}) {
  const { vecs } = vectorizeMessages(messages);
  const strands = [];
  const order = new Array(messages.length).fill(-1);

  for (let i = 0; i < vecs.length; i++) {
    const v = vecs[i];
    // Empty/low-signal message (greetings, "ok", "thanks") → attach to the current
    // strand for continuity rather than spawning a junk topic.
    if (v.size === 0) {
      const sid = i > 0 ? order[i - 1] : -1;
      if (sid >= 0) { strands[sid].messageIndices.push(i); order[i] = sid; continue; }
    }
    let best = -1, bestSim = 0;
    for (const s of strands) {
      const sim = cosine(v, s.centroid);
      if (sim > bestSim) { bestSim = sim; best = s.id; }
    }
    if (best >= 0 && bestSim >= threshold) {
      const s = strands[best];
      addInto(s.centroid, v);
      s.messageIndices.push(i);
      order[i] = best;
    } else {
      const id = strands.length;
      const centroid = new Map(v);
      strands.push({ id, label: [], messageIndices: [i], centroid });
      order[i] = id;
    }
  }

  for (const s of strands) s.label = labelFor(s.centroid);
  return { strands, order };
}
