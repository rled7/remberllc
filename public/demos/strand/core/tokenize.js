// Tokenizer for conversation text: lowercase, split on non-word chars, drop very
// short tokens and a small English stopword set. Pure + dependency-free.

export const STOPWORDS = new Set((
  "a an and are as at be but by for from has have how i if in into is it its of on or " +
  "that the their then there these they this to was were what when where which who will " +
  "with you your we he she him her our us do does did done can could would should may " +
  "might must not no yes so just like get got make made go going about than them too very " +
  "me my mine ours so up out over also been being had having were am"
).split(" "));

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(t => t.length >= 3 && !STOPWORDS.has(t));
}
