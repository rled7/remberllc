import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

// The developer / software-engineering landing — what remberllc.pages.dev is solely about.
// Interactive hover showcase: each project's visual transforms and reveals its details on hover.

interface Work {
  title: string;
  blurb: string;
  tags: string[];
  grad: string;           // the tile's signature gradient
  demo?: string;          // internal live-demo route
  github?: string;
}

const WORK: Work[] = [
  {
    title: 'NexusScale',
    blurb: 'A 100% in-browser image & PDF upscaler — 4K/8K targets, Web-Worker pipeline, fully offline.',
    tags: ['React', 'Canvas', 'Web Workers', 'pdf.js'],
    grad: 'linear-gradient(135deg,#1b2a4a,#3f6f9c 60%,#9bd1ff)',
    demo: '/projects/nexus',
    github: 'https://github.com/rled7/nexus-scale',
  },
  {
    title: 'Strand',
    blurb: 'Auto-organizes one AI chat into labeled topic strands — and searches across every conversation.',
    tags: ['TF-IDF', 'Clustering', 'TypeScript'],
    grad: 'linear-gradient(135deg,#2a1b4a,#6a4fb0 60%,#c8b8ff)',
    demo: '/projects/strand',
    github: 'https://github.com/rled7/strand',
  },
  {
    title: 'Sybil Detection Engine',
    blurb: 'Explainable sybil-wallet scoring — eight transparent signals + union-find clustering.',
    tags: ['Graph clustering', 'TypeScript', 'Cloudflare'],
    grad: 'linear-gradient(135deg,#0f3a2e,#2f8f6b 60%,#9fe8c8)',
    demo: '/projects/sybil',
    github: 'https://github.com/rled7/sybil-detection-engine',
  },
  {
    title: 'RAG Alpha Aggregator',
    blurb: 'Keyless local RAG classifier — bag-of-words cosine retrieval ranks signals by confidence.',
    tags: ['RAG', 'NLP', 'TypeScript'],
    grad: 'linear-gradient(135deg,#4a2a1b,#b0764f 60%,#ffd9b8)',
    demo: '/projects/rag',
    github: 'https://github.com/rled7/rag-alpha-aggregator',
  },
  {
    title: 'Bridge Cost Optimizer',
    blurb: 'Cross-chain bridge route ranking — decomposes true cost into source/destination gas + fees.',
    tags: ['LI.FI', 'Express', 'React'],
    grad: 'linear-gradient(135deg,#3a0f2e,#9c2f6b 60%,#ff9fd1)',
    demo: '/projects/bridge',
    github: 'https://github.com/rled7/bridge-cost-optimizer',
  },
  {
    title: 'Pocket Politics',
    blurb: 'Civic-transparency platform — every politician’s record, money & contact, on one shared API.',
    tags: ['Cloudflare', 'Civic data', 'API'],
    grad: 'linear-gradient(135deg,#13294a,#2f5c9c 60%,#bcd6ff)',
    github: 'https://github.com/rled7/pocket-politics',
  },
];

const STACK = ['TypeScript', 'React', 'Node', 'Cloudflare Workers', 'Vite', 'Python', 'C++', 'RAG / NLP'];

function Portrait() {
  // Drop a real photo at public/profile.jpg to replace the monogram. The hover effect
  // (grayscale → color + lift) works either way.
  return (
    <div className="portrait">
      <img src="/profile.jpg" alt="Rene Ledesma" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <span className="portrait-mono">RL</span>
      <span className="portrait-ring" aria-hidden="true" />
    </div>
  );
}

export default function DevHome() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="dev-hero">
        <div className="shell dev-hero-inner">
          <Reveal className="dev-hero-copy">
            <span className="eyebrow">Software Engineer · Full-Stack</span>
            <h1 className="dev-name">Rene&nbsp;Ledesma</h1>
            <p className="dev-tagline">
              I build fast, useful things on the edge — AI tooling, civic data, and live demos you
              can actually click. Codesmith-trained; React / TypeScript / Node / Cloudflare.
            </p>
            <div className="dev-cta">
              <a className="dbtn dbtn--primary" href="#work">View work ↓</a>
              <a className="dbtn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a>
              <Link className="dbtn" to="/contact">Get in touch</Link>
              <a className="dbtn" href="https://github.com/rled7" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </Reveal>
          <Reveal className="dev-hero-portrait" delay={120}><Portrait /></Reveal>
        </div>
      </section>

      {/* ---- Interactive work showcase ---- */}
      <section className="dev-work section" id="work">
        <div className="shell">
          <div className="section-head">
            <Reveal><span className="eyebrow">Selected work</span><h2 className="dev-h2">Hover any project.</h2></Reveal>
            <Reveal delay={80}><p className="dev-sub">Live demos, not screenshots. Move your cursor over a tile to dig in.</p></Reveal>
          </div>

          <div className="work-grid">
            {WORK.map((w, i) => (
              <Reveal key={w.title} className="work" delay={(i % 3) * 80}>
                <article className="work-card">
                  <div className="work-visual" style={{ backgroundImage: w.grad }}>
                    <span className="work-index">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="work-title">{w.title}</h3>
                  </div>
                  <div className="work-overlay">
                    <h3 className="work-title-o">{w.title}</h3>
                    <p className="work-blurb">{w.blurb}</p>
                    <div className="work-tags">{w.tags.map((t) => <span key={t} className="work-tag">{t}</span>)}</div>
                    <div className="work-links">
                      {w.demo && <Link className="work-link primary" to={w.demo}>Live demo →</Link>}
                      {w.github && <a className="work-link" href={w.github} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Stack ---- */}
      <section className="dev-stack section">
        <div className="shell">
          <Reveal><span className="eyebrow">Toolbox</span></Reveal>
          <Reveal delay={60}>
            <div className="stack-row">{STACK.map((s) => <span key={s} className="chip">{s}</span>)}</div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
