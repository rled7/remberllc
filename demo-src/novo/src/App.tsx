import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { colorways, features, initialScene, statistics } from './content';
import { setupMotion } from './motion';

const SneakerScene = lazy(() => import('./SneakerScene').then((module) => ({ default: module.SneakerScene })));
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 0 37 22 55 9 42 27 64 32 42 37 55 55 37 42 32 64 27 42 9 55 22 37 0 32 22 27 9 9 27 22Z" fill="currentColor" /></svg>;
}

export function App() {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef(initialScene());
  const [colorIndex, setColorIndex] = useState(0);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    window.__novo = scene.current;
    return setupMotion(root.current, scene.current, reduced, setColorIndex);
  }, [reduced]);

  const color = colorways[colorIndex];

  return <div ref={root} className="novo" data-motion={reduced ? 'reduced' : 'full'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="cursor-aura" aria-hidden="true" />
    <div className="depth-field" aria-hidden="true">
      <div className="depth-plane depth-plane--far" data-mouse-depth="0.3"><div className="depth-scroll depth-scroll--far" data-global-depth="0.3"><span className="depth-grid" /><span className="depth-orbit depth-orbit--far" /></div></div>
      <div className="depth-plane depth-plane--middle" data-mouse-depth="0.65"><div className="depth-scroll depth-scroll--middle" data-global-depth="0.65"><span className="depth-orbit depth-orbit--middle" /><span className="depth-cross">+</span></div></div>
      <div className="depth-plane depth-plane--near" data-mouse-depth="1"><div className="depth-scroll depth-scroll--near" data-global-depth="1"><span className="depth-slab depth-slab--left" /><span className="depth-slab depth-slab--right" /><span className="depth-coordinate">N / 01</span></div></div>
    </div>
    <header className="nav" aria-label="Main navigation">
      <a className="wordmark" href="#top" aria-label="NOVO home">NOVO<Star /></a>
      <nav aria-label="Page sections">
        <a href="#features">Design</a>
        <a href="#colorways">Colorways</a>
        <a href="#story">Our story</a>
        <a href="#explore">Explore NOVO <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <Suspense fallback={<div className="scene-stage scene-stage--loading" aria-hidden="true"><img className="scene-fallback" src={asset('images/sneaker-fallback.png')} alt="" /></div>}><SneakerScene state={scene} reduced={reduced} onReady={setReady} /></Suspense>

    <main id="main">
      <section id="top" className="hero" aria-labelledby="hero-heading" data-scene="hero">
        <div className="hero-grid" aria-hidden="true" />
        <span className="hero-orbit" aria-hidden="true" />
        <div className="hero-content scene-content">
          <p className="eyebrow" data-reveal><span className="status-dot" /> THE NEXT EVERYDAY / NOVO 01</p>
          <h1 id="hero-heading"><span className="headline-line" data-reveal>EVERYDAY.</span><span className="headline-line accent" data-reveal>EVOLVED.</span></h1>
          <p className="hero-copy" data-reveal>A new perspective on the everyday.<br />Designed to move differently.</p>
          <a className="button button--light" href="#features" data-reveal>Explore the NOVO 01 <Arrow /></a>
          <div className="hero-note" data-reveal><span>01 — THE ORIGINAL</span><span>FORM. FEELING. FREEDOM.</span></div>
        </div>
        <span className="hero-giant" aria-hidden="true">N / 01</span>
        <div className="hero-product-label scene-content" data-reveal><span className="hairline" /><div><strong>NOVO 01</strong><span>Chalk / Concept edition</span></div><span className="product-cross" aria-hidden="true">+</span></div>
        <p className="model-status scene-content" role="status">{ready ? 'REAL-TIME 3D / SCROLL TO EXPLORE' : 'PREPARING YOUR PERSPECTIVE…'}</p>
        <a className="scroll-cue scene-content" href="#features" aria-label="Scroll to discover the design"><span>SCROLL TO DISCOVER</span><i aria-hidden="true"><b /></i></a>
        <span className="hero-corner scene-content" aria-hidden="true">EST. IN THE FUTURE</span>
      </section>

      <div id="features" className="features">
        {features.map((feature) => <section id={feature.id} key={feature.id} className={`feature ${feature.className}`} data-scene={feature.id} aria-labelledby={`${feature.id}-heading`}>
          <div className="feature-backdrop" aria-hidden="true"><span className="feature-number" data-depth="-0.16">{feature.number}</span><span className="feature-ring" data-depth="-0.1" /><span className="feature-line" data-depth="-0.06" /></div>
          <div className="feature-inner scene-content">
            <p className="eyebrow" data-reveal><span className="section-index">{feature.number} / 03</span>{feature.eyebrow}</p>
            <h2 id={`${feature.id}-heading`}>{feature.title.map((line, i) => <span className={`headline-line ${i === 1 ? 'muted' : ''}`} data-reveal key={line}>{line}</span>)}</h2>
            <p className="body-copy" data-reveal>{feature.description}</p>
            <div className="feature-detail" data-reveal><span className="detail-cross">+</span><span>{feature.detail}</span><span className="detail-rule" /></div>
          </div>
          <span className="feature-side-label scene-content" data-reveal>NOVO 01 / {feature.number === '01' ? 'FORM' : feature.number === '02' ? 'FEELING' : 'DETAIL'}</span>
        </section>)}
      </div>

      <section id="colorways" className="color-journey" data-scene="colorways" aria-labelledby="color-heading">
        <div className="color-sticky">
          <div className="color-heading scene-content"><p className="eyebrow" data-reveal>ONE SILHOUETTE. YOUR EXPRESSION.</p><h2 id="color-heading" data-reveal>FIND YOUR<br /><span className="outline-text">FREQUENCY.</span></h2></div>
          <span className="color-giant" aria-hidden="true">{color.name.toUpperCase()}</span>
          <div className="color-current scene-content"><span className="eyebrow">NOVO 01 / {color.code}</span><h3>{color.name}<span>®</span></h3><p>{color.description}</p></div>
          <div className="color-controls scene-content" aria-label="Explore four colorways">
            {colorways.map((way, index) => <button key={way.name} className={`color-swatch ${index === colorIndex ? 'is-active' : ''}`} style={{ '--swatch': way.color } as CSSProperties} aria-label={`Explore ${way.name} colorway`} aria-pressed={index === colorIndex} onClick={() => {
              const section = document.getElementById('colorways')!;
              if (reduced) { setColorIndex(index); return; }
              const start = section.offsetTop;
              const range = section.offsetHeight - window.innerHeight;
              window.scrollTo({ top: start + range * index / 3, behavior: 'smooth' });
            }}><i /><span>{way.name}</span></button>)}
          </div>
          <div className="color-progress scene-content" aria-hidden="true"><span>{color.code}</span><i><b /></i><span>04</span></div>
          <div className="reduced-color-list">{colorways.map((way) => <div key={way.name} style={{ background: way.background }}><i style={{ background: way.color }} /><span>{way.name}</span></div>)}</div>
        </div>
      </section>

      <section id="story" className="story" aria-labelledby="story-heading">
        <div className="story-top"><p className="eyebrow" data-reveal>THE NOVO POINT OF VIEW</p><Star className="story-star" /></div>
        <h2 id="story-heading" className="story-lines"><span data-story-line>THE WORLD DOESN’T</span><span data-story-line>NEED MORE <em>NOISE.</em></span><span data-story-line>IT NEEDS A LITTLE</span><span data-story-line>MORE <em className="accent">YOU.</em></span></h2>
        <div className="story-bottom"><span className="eyebrow" data-reveal>GO YOUR OWN WAY.</span><p className="body-copy" data-reveal>We believe the things you wear should make room for who you are. NOVO is a concept built around that simple idea. Fewer distractions. More possibilities.</p></div>
      </section>

      <section id="stats" className="stats" aria-labelledby="stats-heading">
        <div className="stats-intro"><p className="eyebrow" data-reveal>SMALL DETAILS. A BIGGER PICTURE.</p><h2 id="stats-heading" className="sr-only">Inside the NOVO concept</h2><span className="demo-label" data-reveal>THIS CONCEPT, IN NUMBERS</span></div>
        <div className="stats-grid">{statistics.map((stat) => <div className="stat" key={stat.label}><div className="stat-content" data-reveal><span className="stat-number" data-counter={stat.value} data-pad={stat.pad} aria-hidden="true">{String(stat.value).padStart(2, '0')}</span><span className="sr-only">{stat.value}</span><h3>{stat.label}</h3><span className="stat-line" /></div></div>)}</div>
      </section>

      <section id="explore" className="closing" aria-labelledby="closing-heading">
        <div className="closing-light" aria-hidden="true" /><div className="closing-grid" aria-hidden="true" />
        <div className="closing-content"><p className="eyebrow" data-reveal>YOUR NEXT MOVE STARTS HERE.</p><h2 id="closing-heading"><span data-reveal>GO BEYOND</span><span className="outline-text" data-reveal>THE EVERYDAY.</span></h2><p className="closing-tagline" data-reveal>Find a new rhythm. Make the everyday your own.</p><a className="button button--accent" href="#colorways" data-reveal>Find your colorway <Arrow diagonal /></a><span className="closing-note" data-reveal>FOUR EXPRESSIONS. ONE NOVO.</span></div>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand"><a className="wordmark" href="#top" aria-label="NOVO back to top" data-reveal>NOVO<Star /></a><p data-reveal>A study in movement.<br />A different everyday.</p></div>
        <nav aria-label="Explore NOVO" data-reveal><h3>EXPLORE</h3><a href="#top">The NOVO 01</a><a href="#colorways">Colorways</a><a href="#explore">Your next move</a></nav>
        <nav aria-label="Product design" data-reveal><h3>THE DESIGN</h3><a href="#form">Adaptive Sole</a><a href="#feeling">Precision Weight</a><a href="#detail">Breathable Mesh</a></nav>
        <nav aria-label="About this concept" data-reveal><h3>OUR WORLD</h3><a href="#story">Our story</a><a href="#stats">In numbers</a><a href={asset('credits.html')}>Concept & credits ↗</a></nav>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} NOVO. A design concept.</p><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
    </footer>
  </div>;
}
