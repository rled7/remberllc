import { Link } from 'react-router-dom';

export default function Business() {
  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">Rember LLC Trucking</h2>
        {/* TODO: confirm tagline */}
        <p className="section-sub">
          Reliable freight, hauled with owner-operator care — nationwide.
        </p>
      </div>

      <div className="business-content">
        <div className="biz-card">
          <h3>About Us</h3>
          <p>
            Rember LLC is a carrier — owner-operated and proudly so. We own and operate our
            truck directly, which means you always deal with the driver, the decision-maker,
            and the person who loads and delivers your freight. No dispatchers in the way,
            no hand-offs to anonymous drivers: just direct accountability from pickup to
            drop-off.
          </p>
          <p>
            Starting with one truck is intentional. It keeps our standards high, our
            communication personal, and our focus entirely on your load. Every shipment gets
            our full attention — not a fraction of a fleet manager's spreadsheet.
          </p>
        </div>

        <div className="biz-card">
          <h3>Services</h3>
          <ul>
            <li>All freight types — dry, general, and more</li>
            <li>OTR (over-the-road) — nationwide coverage</li>
            <li>Regional lanes</li>
            <li>Local delivery</li>
          </ul>
          <p>
            Whether you need a load moved across the country or across the region, we run it.
            No freight type is too routine; no lane is out of reach.
          </p>
        </div>

        <div className="biz-card">
          <h3>Coverage</h3>
          <p>
            We operate nationally — OTR runs that cross state lines and coast-to-coast lanes,
            regional routes, and local pickup and delivery.
          </p>
          {/* TODO: confirm specific base/service state */}
          <p className="placeholder-note">TODO: confirm specific base / service state</p>
          <p>
            Contact us to confirm availability for your specific lane.
          </p>
        </div>

        <div className="biz-card">
          <h3>Operating Authority</h3>
          <p>
            Rember LLC currently operates under our partner carrier's authority (leased on).
          </p>
          {/* TODO: add 3PL/partner carrier name here once confirmed */}
          <p className="placeholder-note">TODO: confirm 3PL / partner carrier name</p>
          <p>
            All freight is moved in full compliance with FMCSA regulations. We do not
            publish authority numbers here; contact us directly for carrier verification
            and insurance documentation.
          </p>
        </div>

        <div className="biz-card">
          <h3>Why Owner-Operated?</h3>
          <p>
            When you book with an owner-operator, you get the person who cares most about
            the load: the owner. We have a direct stake in your freight arriving on time and
            intact — our livelihood depends on it. That's the accountability a fleet can't
            replicate.
          </p>
          <ul>
            <li>Direct communication — call the driver, not a call center</li>
            <li>Careful, attentive handling — one truck, one focus</li>
            <li>No middle-man markup or brokered surprises</li>
            <li>Personal relationship with every customer</li>
          </ul>
        </div>

        <div className="biz-card">
          <h3>Ready to Move Your Freight?</h3>
          <p>
            Get in touch to request a quote or discuss your lane. We respond promptly.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link to="/contact" className="project-link" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
              Contact Us &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
