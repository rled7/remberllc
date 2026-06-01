import Reveal from '../components/Reveal';

export default function Contact() {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">Contact</span>
          <h2>Request a freight quote, or just reach out.</h2>
          <p className="lead">We respond promptly — you'll be talking to the driver, directly.</p>
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <span className="contact-value">
                  <a href="mailto:rledesma@remberllc.com">rledesma@remberllc.com</a>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <span className="contact-value">
                  <a href="tel:+19255033814">925-503-3814</a>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-label">Address</span>
                <span className="contact-value todo">
                  {/* TODO: Rember LLC registered business address */}
                  <span className="placeholder-note">TODO: registered business address</span>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-label">Authority</span>
                <span className="contact-value" style={{ fontSize: '0.95rem', color: 'var(--ink-soft)' }}>
                  Operating under partner carrier's authority — contact us for the carrier packet
                  &amp; insurance docs.
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="quote-box">
              <h3>Requesting a quote</h3>
              <p>To get back to you quickly with availability and pricing, please include:</p>
              <ul>
                <li>Origin &amp; destination</li>
                <li>Freight type</li>
                <li>Approximate weight</li>
                <li>Target pickup window</li>
              </ul>
              <a className="btn btn--accent" href="mailto:rledesma@remberllc.com">
                Email us <span className="arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
