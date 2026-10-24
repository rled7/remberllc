// Declarative C function-signature description for a Problem. Only scalar
// int/bool/string and 1D/fixed-width-2D array shapes are modeled — enough to
// cover the curriculum's pure-algorithmic problems (arrays, strings, DP,
// greedy). Linked-list/tree/graph problems and stateful "operations"
// problems (LRU cache, trie, etc.) are out of scope for this type system;
// such problems simply omit `cSignature` and fall back to JS-only.
//
// Array-returning functions follow the LeetCode-C convention: the candidate
// mallocs the result and reports its length via an appended `int*
// returnSize` out-param. The harness process exits right after printing, so
// the allocation is never freed — that's fine, not a leak in any long-lived
// sense.

export type CParam =
  | { kind: "int"; name: string }
  | { kind: "bool"; name: string }
  | { kind: "string"; name: string }
  | { kind: "intArray"; name: string; sizeName: string }
  | { kind: "stringArray"; name: string; sizeName: string }
  | { kind: "intMatrix"; name: string; sizeName: string; cols: number };

export type CReturn =
  | { kind: "int" }
  | { kind: "bool" }
  | { kind: "string" }
  | { kind: "intArray" }
  | { kind: "stringArray" };

export interface CSignature {
  params: CParam[];
  returns: CReturn;
}
