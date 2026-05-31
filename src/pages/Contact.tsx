export default function Contact() {
  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">Contact Rember LLC</h2>
        <p className="section-sub">
          Request a freight quote or reach out — we respond promptly.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-item">
          <span className="contact-label">Email</span>
          <span className="contact-value">
            <a href="mailto:rledesma@remberllc.com">rledesma@remberllc.com</a>
          </span>
        </div>

        <div className="contact-item">
          <span className="contact-label">Phone</span>
          <span className="contact-value">
            <a href="tel:+19255034248">925-503-4248</a>
          </span>
        </div>

        <div className="contact-item">
          <span className="contact-label">Address</span>
          <span className="contact-value" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {/* TODO: Rember LLC registered business address */}
            TODO: Rember LLC registered business address
          </span>
        </div>

        <div className="contact-item">
          <span className="contact-label">Authority</span>
          <span className="contact-value" style={{ color: 'var(--text-secondary)' }}>
            Operating under partner carrier's authority — contact us for carrier packet &amp; insurance docs
          </span>
        </div>
      </div>

      <div style={{ marginTop: 32, maxWidth: 560 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          To request a quote, please share your origin, destination, freight type, and
          approximate weight. We'll get back to you with availability and pricing.
        </p>
      </div>
    </div>
  );
}
