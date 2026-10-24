import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Reveal from '../components/Reveal';

export default function NovoDemo() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <section className="section novo-case-study">
      <div className="shell">
        <Reveal>
          <Link to="/portfolio" className="devzone-back">&larr; Portfolio</Link>
          <span className="eyebrow">Frontend / Interactive brand experience</span>
          <h1 className="dev-title">NOVO — a different perspective.</h1>
          <p className="lead">A premium sneaker concept demonstrating parallax, scroll controlled transitions, and responsive 3D. Move the mouse to explore the depth, scroll through the product story, and find your colorway.</p>
          <div className="novo-case-actions">
            <a className="dbtn dbtn--primary" href="/demos/novo/" target="_blank" rel="noopener noreferrer">Launch full screen demo ↗</a>
            <a className="dbtn" href="#novo-preview">Explore the preview ↓</a>
          </div>
          <div className="novo-industries" aria-label="Suitable brand formats">
            {['Perfume', 'Premium property', 'Fashion', 'Creative portfolios', 'Premium services'].map((label) => <span className="chip" key={label}>{label}</span>)}
          </div>
        </Reveal>

        <div id="novo-preview" className="demo-frame">
          <div className="demo-frame-bar"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span className="url">NOVO / interactive brand concept</span><a className="novo-frame-link" href="/demos/novo/" target="_blank" rel="noopener noreferrer">Full screen ↗</a></div>
          <iframe title="NOVO premium sneaker live demonstration" src="/demos/novo/" className="embed-frame novo-embed" loading="lazy" allow="fullscreen" sandbox="allow-scripts allow-same-origin" />
        </div>
        <p className="novo-preview-note">Scroll inside the preview, or launch the full screen experience for the complete composition.</p>

        <div className="novo-capabilities">
          <Reveal><span className="eyebrow">01 / Depth</span><h2>Parallax you can explore.</h2><p>Slower background planes, a floating 3D product, and a visible cursor follower create a layered scene that responds to movement.</p></Reveal>
          <Reveal delay={70}><span className="eyebrow">02 / Narrative</span><h2>Scroll sets the pace.</h2><p>Three feature perspectives lead into four coordinated colorways, a line-by-line brand story, animated numbers, and a clear call to action.</p></Reveal>
          <Reveal delay={140}><span className="eyebrow">03 / Adaptability</span><h2>A format for visual brands.</h2><p>The product, artwork, copy, metrics, and action can change for a perfume, property, fashion collection, portfolio, or premium service.</p></Reveal>
        </div>
        <p className="novo-case-footnote">Built with React, TypeScript, Three.js, and GSAP. The sneaker is an attributed sample model; product copy and metrics identify this as a design concept.</p>
      </div>
    </section>
  );
}
