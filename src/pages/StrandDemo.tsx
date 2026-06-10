import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// Strand is a zero-build static app (plain ES modules, relative paths). Its runtime
// (index.html + app.js + core/) is copied verbatim into public/demos/strand/ and
// embedded same-origin via an iframe — no build step, no base rewrite needed.
export default function StrandDemo() {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">Strand — auto-organize one conversation by topic</h2>
          <p className="lead">
            A single AI chat rarely stays on one topic — it drifts across projects. Strand silently
            fans one ongoing thread into labeled <strong>topic strands</strong>, so you can pull up
            "everything about X" and feed the model only the relevant slice. Three modes:{' '}
            <strong>Organize</strong> a pasted thread, <strong>Live</strong> routing as you type, and{' '}
            <strong>Memory</strong> — search across every past conversation at once. 100% local,
            zero dependencies; the wedge is that it's <em>automatic</em>, not manual folders.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/demos/strand</span>
            </div>
            <iframe
              title="Strand live demo"
              src="/demos/strand/"
              className="embed-frame"
              loading="lazy"
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <p className="lead" style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Try it: click <strong>Load sample</strong> → <strong>Organize</strong>, then switch to{' '}
            <strong>Memory</strong> and search <em>"broker adapter parity test"</em>. Or{' '}
            <a href="/demos/strand/" target="_blank" rel="noopener noreferrer">open it in its own tab</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
