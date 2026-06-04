import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <>
      {/* ---- 01 / About ---- */}
      <section className="section">
        <div className="shell split">
          <Reveal className="biz-hero">
            <span className="eyebrow">01 / About</span>
            <h1>About Us</h1>
            <p className="lead">
              Owner-operated freight, hauled with direct accountability — from pickup to
              drop-off.
            </p>
          </Reveal>

          <Reveal className="prose" delay={120}>
            <p>
              Rember LLC is an owner-operated trucking carrier. We run one truck, all
              freight types — dry, general cargo, and more — across national over-the-road
              (OTR) lanes as well as regional and local routes.
            </p>
            <p>
              Starting with one truck is a deliberate choice. It means every load gets the
              owner's full attention. You're not dealing with a dispatcher relaying messages
              or an anonymous driver from a pool. You're dealing with the person who owns
              the truck, loaded the freight, and is responsible for delivering it on time.
            </p>
            <p>
              We are proud to operate as a small carrier and intend to stay that way long
              enough to earn a track record worth growing on.
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href="tel:+19255033814">925-503-3814</a>
              <br />
              <strong>Email:</strong>{' '}
              <a href="mailto:rledesma@remberllc.com">rledesma@remberllc.com</a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 02 / Operating Authority ---- */}
      <section className="section--tight">
        <div className="shell">
          <Reveal className="section-head">
            <span className="eyebrow">02 / Operating authority</span>
            <h2>How we operate legally.</h2>
          </Reveal>

          <div className="feature-grid">
            <Reveal>
              <div className="feature-card">
                <h3>Current authority</h3>
                <p>
                  Rember LLC currently operates under a 3PL partner carrier's operating
                  authority (leased-on arrangement). We do not yet hold an independent MC
                  number. Contact us directly for carrier verification and the full carrier
                  packet.
                </p>
                <span className="placeholder-note">
                  {'{{ FILL IN: 3PL / partner carrier name }}'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="feature-card">
                <h3>USDOT number</h3>
                <p>
                  Our USDOT number is required for shipper verification and safety rating
                  lookups on FMCSA's SAFER system. Add it below once obtained or confirmed.
                </p>
                <span className="placeholder-note">
                  {'{{ FILL IN: USDOT number }}'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="feature-card">
                <h3>MC authority (future)</h3>
                <p>
                  Once Rember LLC files for and receives its own operating authority, the MC
                  number will be listed here for shipper verification. Until then, freight
                  moves under the 3PL partner's MC.
                </p>
                <span className="placeholder-note">
                  {'{{ FILL IN: MC number if obtained }}'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="feature-card">
                <h3>Insurance &amp; compliance</h3>
                <p>
                  Every shipment moves in full compliance with FMCSA regulations. Contact us
                  for the carrier packet and current insurance documentation.
                </p>
                <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', color: 'var(--accent-strong)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                  Request carrier packet <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- 03 / Mission Statement ---- */}
      <section className="section--tight">
        <div className="shell split">
          <Reveal className="section-head">
            <span className="eyebrow">03 / Mission</span>
            <h2>Why we haul freight the way we do.</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="feature-card">
              {/* DRAFT — owner should review and replace */}
              <p>
                Rember LLC exists to move freight reliably, on time, and without excuses —
                because our reputation is on the line with every load we touch. We believe
                owner-operated carriers hold themselves to a higher standard of
                accountability than a fleet ever can, and we intend to prove it every day
                we're on the road.
              </p>
              <span className="placeholder-note">
                {'{{ EDIT: your mission statement }}'}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- CTA band ---- */}
      <section className="section--tight">
        <div className="shell">
          <Reveal className="cta-band">
            <div>
              <h2>Ready to work together?</h2>
              <p>Reach out with your lane and load details — we respond promptly.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn--on-dark">
                Get in touch <span className="arrow" aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/business" className="btn btn--ghost-dark">
                Our services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
