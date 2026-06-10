import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const TRUST = [
  { k: 'Owner-operated', v: 'You deal with the driver — every load' },
  { k: 'Nationwide', v: 'OTR, regional & local lanes' },
  { k: 'Direct line', v: 'No call center, no brokered surprises' },
];

const CARDS = [
  {
    num: '01',
    to: '/business',
    title: 'Services',
    desc: 'Freight types & coverage — what we haul, and how we run OTR, regional & local.',
  },
  {
    num: '02',
    to: '/about',
    title: 'About',
    desc: 'Who’s behind the wheel — owner-operated, with direct accountability on every load.',
  },
  {
    num: '03',
    to: '/contact',
    title: 'Get a quote',
    desc: 'Request a freight quote or get in touch — we respond promptly.',
  },
];

export default function Hub() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="shell hero-inner">
          <Reveal as="div">
            <span className="eyebrow">Rember LLC &middot; Carrier</span>
          </Reveal>

          <Reveal as="h1" delay={80}>
            Reliable freight,
            <br />
            hauled with <span className="hl">care.</span>
          </Reveal>

          <Reveal as="p" className="hero-lead" delay={180}>
            Owner-operated trucking you can actually reach. One truck, full attention —
            nationwide over-the-road, regional, and local delivery with direct
            accountability from pickup to drop-off.
          </Reveal>

          <Reveal className="hero-cta" delay={260}>
            <Link to="/contact" className="btn btn--accent">
              Get a quote <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
            <Link to="/business" className="btn btn--ghost">
              Our services
            </Link>
          </Reveal>

          <Reveal className="trust-row" delay={340}>
            {TRUST.map((t) => (
              <div className="trust-item" key={t.k}>
                <span className="trust-k">{t.k}</span>
                <span className="trust-v">{t.v}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <span className="dot" />
        </div>
      </section>

      {/* ---- Explore ---- */}
      <section className="section--tight">
        <div className="shell">
          <Reveal className="section-head">
            <span className="eyebrow">Explore</span>
            <h2>Owner-operated freight, done right.</h2>
          </Reveal>

          <div className="nav-cards">
            {CARDS.map((c, i) => (
              <Reveal key={c.to} delay={i * 90}>
                <Link to={c.to} className="nav-card">
                  <span className="num">{c.num}</span>
                  <div className="nav-card-title">{c.title}</div>
                  <div className="nav-card-desc">{c.desc}</div>
                  <span className="go">
                    Enter <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
