import workerAsset from './practice.worker.ts?worker&url';
import type { RunResult } from './runner';

// The worker has its own CSP, no DOM or localStorage, and a hard per-run limit.
export function runPublicTests(code: string, problemId: string, signal: AbortSignal): Promise<RunResult> {
  return new Promise((resolve) => {
    const asset = new URL(workerAsset, import.meta.url).pathname;
    const worker = new Worker(`/api/dsa-runner?asset=${encodeURIComponent(asset)}`);
    let executionTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = (result: RunResult) => {
      clearTimeout(startupTimer);
      clearTimeout(executionTimer);
      signal.removeEventListener('abort', cancel);
      worker.terminate();
      resolve(result);
    };
    const fail = (message: string) => finish({ allPassed: false, results: [], compileError: message });
    const cancel = () => fail('Run cancelled.');
    const startupTimer = setTimeout(() => fail('The test runner could not load. Please try again.'), 12000);
    signal.addEventListener('abort', cancel, { once: true });
    if (signal.aborted) { cancel(); return; }
    worker.onerror = () => fail('The test runner encountered an error. Check your code and try again.');
    worker.onmessage = (event) => {
      if (event.data.ready) {
        clearTimeout(startupTimer);
        executionTimer = setTimeout(() => fail('Time limit exceeded (2.5 seconds). Check for an infinite loop.'), 2500);
        worker.postMessage({ problemId, code });
      } else finish(event.data as RunResult);
    };
  });
}
