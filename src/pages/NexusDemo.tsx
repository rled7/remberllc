import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// NexusScale is a full standalone Vite app (workers, pdf.js, canvas pipeline). Rather
// than re-implement its 57KB component here, the real built app is served as static
// assets from public/demos/nexus/ and embedded same-origin via an iframe — so downloads,
// Web Workers, and the offline pipeline all work exactly as they do standalone.
export default function NexusDemo() {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Live demo</span>
          <h2 className="dev-title">NexusScale — image &amp; PDF upscaler</h2>
          <p className="lead">
            A 100% in-browser image and PDF upscaler. Drop an image or a multi-page PDF, pick a
            multiplier or a <strong>4K / 8K</strong> resolution target, and it enhances on-device —
            bicubic resampling plus denoise / contrast / sharpen, run off the main thread in a Web
            Worker so the UI never freezes. <strong>Nothing leaves your machine:</strong> zero network
            calls, no API keys, no uploads. The 8K output and the zero-network claim are verified by a
            real-browser smoke test.
          </p>

          <div className="demo-frame">
            <div className="demo-frame-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">remberllc.com/demos/nexus</span>
            </div>
            <iframe
              title="NexusScale live demo"
              src="/demos/nexus/"
              className="embed-frame"
              loading="lazy"
              allow="fullscreen"
            />
          </div>
          <p className="lead" style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Tip: for the full experience,{' '}
            <a href="/demos/nexus/" target="_blank" rel="noopener noreferrer">open it in its own tab</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
