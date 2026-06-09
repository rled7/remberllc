// Retrieval: given a query, rank strands by relevance (TF-IDF cosine against each
// strand centroid) so a model call can be fed ONLY the relevant strand(s). This is
// "RAG over your own conversation" from the pitch, in its simplest honest form.
import { tokenize } from "./tokenize.js";
import { tfidf, cosine } from "./vectorize.js";

// strands from segment(); idfMap from vectorizeMessages (pass it through so query
// terms are weighted consistently with the corpus).
export function rankStrands(query, strands, idfMap) {
  const qv = tfidf(tokenize(query), idfMap);
  return strands
    .map(s => ({ id: s.id, label: s.label, score: cosine(qv, s.centroid) }))
    .sort((a, b) => b.score - a.score);
}

export function bestStrand(query, strands, idfMap) {
  const ranked = rankStrands(query, strands, idfMap);
  return ranked.length && ranked[0].score > 0 ? ranked[0] : null;
}
