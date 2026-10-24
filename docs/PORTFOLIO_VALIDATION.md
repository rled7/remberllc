# Portfolio update validation

Validated locally in visible Chromium with Cloudflare Pages emulation on October 23, 2026. This includes the production CSP and Pages Functions rather than Vite alone.

- DSA exercises report wrong and correct solutions against real test cases, including order-normalized answers. Syntax failures render feedback. Infinite loops terminate after the execution limit, leaving the interface responsive. Navigation cancels a pending run.
- DSA solved progress persists after navigation and reload; solution download works. The public UI has no GitHub-token field and makes no requests to a visitor's local Ollama server.
- DSA layouts were resized through 1024, 768, 390, and 320 pixels. iPhone touch emulation verifies controls and reference-solution access. The system-design grid overflow found at 320 pixels was corrected.
- A real Stockfish game accepts a legal move and produces an engine explanation when the API returns `coach_not_configured`. Mocked successful AI responses display their source correctly; starting a new game cancels stale responses.
- The portrait loads from the self-hosted image and displays its original color. The résumé response matches SHA-256 `c5745d078e9b3016719d9504f5467b265d62524adff0098d614e504e577cd79a`, the exact October 16, 2026 PDF.
- The portfolio smoke animates, scroll progress changes its palette, and the demo grid blends into Matrix rain. Both desktop and touch navigation remain usable. Reduced motion stops animation time; WebGL failure retains a readable backdrop.
- The trucking mode does not mount the portfolio renderer.

After reducing the smoke's drawing resolution and tightening its quality adjustment, a 180-frame workstation sample measured 16.7 ms median and 17.7 ms at the 95th percentile. Two frames exceeded 34 ms (maximum 66.9 ms). These are local observations under browser automation, not a guarantee for other devices. Phone checks use browser emulation; physical-device testing remains separate.

See [NOVO's detailed validation](NOVO_VALIDATION.md) for its 19 scene, scrolling, performance, resizing, fallback, and mobile checks.
