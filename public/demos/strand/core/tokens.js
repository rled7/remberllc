// Token estimation + the savings story: how many tokens you'd feed a model to
// answer within ONE strand vs dragging the whole thread into every call. This is
// the "token-savings counter" from the pitch — the product's tangible side effect.
//
// Estimate: ~4 chars/token (a standard rough heuristic for English). Swap in a real
// tokenizer for production; the relative savings stays meaningful regardless.

export function estimateTokens(text) {
  return Math.ceil(String(text).length / 4);
}

export function messageTokens(messages) {
  return messages.map(m => estimateTokens(m.text));
}

// Given messages + a segmentation, report the full-thread cost vs the per-strand cost.
export function savings(messages, strands) {
  const perMsg = messageTokens(messages);
  const full = perMsg.reduce((a, b) => a + b, 0);
  const perStrand = strands.map(s => ({
    id: s.id,
    label: s.label,
    tokens: s.messageIndices.reduce((a, i) => a + perMsg[i], 0),
    messages: s.messageIndices.length,
  }));
  // "Average question" cost = mean strand size (you inject only the relevant strand).
  const avgStrand = perStrand.length ? Math.round(perStrand.reduce((a, s) => a + s.tokens, 0) / perStrand.length) : 0;
  const reduction = full ? 1 - avgStrand / full : 0;
  return { full, perStrand, avgStrand, reductionPct: Math.round(reduction * 100) };
}
