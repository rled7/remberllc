import { findProblem } from './data/curriculum';
import { runTests } from './runner';

self.onmessage = (event: MessageEvent<{ problemId: string; code: string }>) => {
  const found = findProblem(event.data.problemId);
  if (!found) {
    self.postMessage({ allPassed: false, results: [], compileError: 'Problem not found.' });
    return;
  }
  const result = runTests(event.data.code, found.problem);
  try {
    self.postMessage(result);
  } catch {
    self.postMessage({ allPassed: false, results: [], compileError: 'Return serializable values from your solution.' });
  }
};
self.postMessage({ ready: true });
