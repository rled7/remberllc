import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// Rember Chess is a zero-build static app (plain ES modules, relative paths, a
// vendored single-threaded Stockfish WASM engine). Its runtime is copied verbatim
// into public/demos/chess/ and embedded same-origin via an iframe. The optional
// "Explain this move" coach calls the same-origin /api/explain Pages Function.
export default function ChessDemo() {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">Rember Chess — play the engine, get coached</h2>
          <p className="lead">
            A refined browser chess game. Play a real <strong>Stockfish</strong> engine at
            adjustable strength, solve the <strong>daily puzzle</strong>, and switch on
            <strong> coach mode</strong>: a live eval bar and a per-move verdict come from the engine
            locally (free, instant), while an on-demand <strong>&ldquo;Explain this move&rdquo;</strong>{' '}
            asks a model for a plain-English reason — grounded in the engine&rsquo;s own eval numbers.
            Vendored single-threaded engine, so it needs no special headers; the whole board runs
            client-side.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/demos/chess</span>
            </div>
            <iframe
              title="Rember Chess live demo"
              src="/demos/chess/"
              className="embed-frame"
              loading="lazy"
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <p className="lead" style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Try it: make a move, watch the eval bar swing, then turn on <strong>Coach</strong> and hit{' '}
            <strong>Explain this move</strong>. Or{' '}
            <a href="/demos/chess/" target="_blank" rel="noopener noreferrer">open it in its own tab</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
