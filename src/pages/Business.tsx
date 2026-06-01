import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const FEATURES = [
  {
    ic: '■', // dry/general freight
    title: 'All freight types',
    body: <p>Dry, general, and more — no load is too routine. If it needs to move, we run it.</p>,
  },
  {
    ic: '↑', // OTR
    title: 'Over-the-road',
    body: <p>Nationwide OTR runs that cross state lines and coast-to-coast lanes.</p>,
  },
  {
    ic: '⇄', // regional
    title: 'Regional & local',
    body: <p>Regional routes and local pickup &amp; delivery, handled with the same care.</p>,
  },
  {
    ic: '✓', // compliance
    title: 'Compliant & insured',
    body: (
      <p>
        Every shipment moves in full compliance with FMCSA regulations. Contact us for the
        carrier packet &amp; insurance documentation.
      </p>
    ),
  },
];

export default function Business() {
  return (
    <>
      {/* ---- Intro ---- */}
      <section className="section">
        <div className="shell split">
          <Reveal className="biz-hero">
            <span className="eyebrow">Trucking</span>
            <h1>Rember LLC Trucking</h1>
            {/* TODO: confirm tagline */}
            <p className="lead">
              Reliable freight, hauled with owner-operator care — nationwide.
            </p>
          </Reveal>

          <Reveal className="prose" delay={120}>
            <p>
              Rember LLC is a carrier — owner-operated and proudly so. We own and operate our
              truck directly, which means you always deal with the driver, the decision-maker,
              and the person who loads and delivers your freight. No dispatchers in the way, no
              hand-offs to anonymous drivers: just direct accountability from pickup to drop-off.
            </p>
            <p>
              Starting with one truck is intentional. It keeps our standards high, our
              communication personal, and our focus entirely on your load. Every shipment gets
              our full attention — not a fraction of a fleet manager's spreadsheet.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Services ---- */}
      <section className="section--tight">
        <div className="shell">
          <Reveal className="section-head">
            <span className="eyebrow">01 / Services</span>
            <h2>What we haul, and where.</h2>
          </Reveal>

          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="feature-card">
                  <span className="ic" aria-hidden="true">{f.ic}</span>
                  <h3>{f.title}</h3>
                  {f.body}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Coverage + Authority ---- */}
      <section className="section--tight">
        <div className="shell split">
          <Reveal>
            <div className="feature-card">
              <h3>Coverage</h3>
              <p>
                We operate nationally — OTR runs that cross state lines and coast-to-coast lanes,
                regional routes, and local pickup and delivery. Contact us to confirm
                availability for your specific lane.
              </p>
              {/* TODO: confirm specific base/service state */}
              <span className="placeholder-note">TODO: confirm specific base / service state</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="feature-card">
              <h3>Operating authority</h3>
              <p>
                Rember LLC currently operates under our partner carrier's authority (leased on).
                We do not publish authority numbers here; contact us directly for carrier
                verification and insurance documentation.
              </p>
              {/* TODO: add 3PL/partner carrier name here once confirmed */}
              <span className="placeholder-note">TODO: confirm 3PL / partner carrier name</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Why owner-operated ---- */}
      <section className="section--tight">
        <div className="shell split">
          <Reveal className="section-head" delay={0}>
            <span className="eyebrow">02 / Why owner-operated</span>
            <h2>The person who cares most about the load is the owner.</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="feature-card">
              <p>
                When you book with an owner-operator, you get a direct stake in your freight
                arriving on time and intact — our livelihood depends on it. That's the
                accountability a fleet can't replicate.
              </p>
              <ul>
                <li>Direct communication — call the driver, not a call center</li>
                <li>Careful, attentive handling — one truck, one focus</li>
                <li>No middle-man markup or brokered surprises</li>
                <li>A personal relationship with every customer</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- CTA band ---- */}
      <section className="section--tight">
        <div className="shell">
          <Reveal className="cta-band">
            <div>
              <h2>Ready to move your freight?</h2>
              <p>Share your lane and we'll get back to you with availability and pricing.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn--on-dark">
                Request a quote <span className="arrow" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
