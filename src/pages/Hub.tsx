import { Link } from 'react-router-dom';

export default function Hub() {
  return (
    <div className="page">
      <div className="hub-hero">
        {/* Primary identity: Rember LLC Trucking */}
        <div className="hub-logo-mark" role="img" aria-label="Rember LLC Trucking">
          &#9660;
        </div>
        <h1 className="hub-name">Rember LLC Trucking</h1>
        {/* TODO: confirm tagline */}
        <p className="hub-tagline">
          Reliable freight, hauled with owner-operator care — nationwide.
        </p>

        {/* Primary CTAs */}
        <div className="hub-links">
          <Link to="/contact" className="link-button accent">
            <span className="link-button-icon">&#9993;</span>
            Get a Quote — Contact Us
          </Link>
          <Link to="/business" className="link-button">
            <span className="link-button-icon">&#9656;</span>
            Our Trucking Services
          </Link>
        </div>

        {/* Secondary nav cards */}
        <div className="hub-nav-cards">
          <Link to="/business" className="nav-card">
            <div className="nav-card-title">Trucking</div>
            <div className="nav-card-desc">Services, coverage &amp; freight types</div>
          </Link>
          <Link to="/portfolio" className="nav-card">
            <div className="nav-card-title">Portfolio</div>
            <div className="nav-card-desc">Software projects by Rene Ledesma</div>
          </Link>
          <Link to="/contact" className="nav-card">
            <div className="nav-card-title">Contact</div>
            <div className="nav-card-desc">Request a quote &middot; get in touch</div>
          </Link>
        </div>

        {/* Tertiary: GitHub link for dev work */}
        <div className="hub-secondary-links">
          <a
            href="https://github.com/rled7"
            target="_blank"
            rel="noopener noreferrer"
            className="hub-text-link"
          >
            GitHub — github.com/rled7
          </a>
        </div>
      </div>
    </div>
  );
}
