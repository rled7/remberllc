import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hub from './pages/Hub';
import DevHome from './pages/DevHome';
import Business from './pages/Business';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import BridgeDemo from './pages/BridgeDemo';
import SybilDemo from './pages/SybilDemo';
import RagDemo from './pages/RagDemo';
import NexusDemo from './pages/NexusDemo';
import StrandDemo from './pages/StrandDemo';
import { siteMode, OTHER_SITE } from './site';

export default function App() {
  const site = siteMode();
  const other = OTHER_SITE[site];

  return (
    <div className={`app site-${site}`}>
      <NavBar site={site} />
      <main className="app-content">
        <Routes>
          {/* Home depends on which site this host is: dev portfolio vs trucking business. */}
          <Route path="/" element={site === 'dev' ? <DevHome /> : <Hub />} />
          <Route path="/business" element={<Business />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects/bridge" element={<BridgeDemo />} />
          <Route path="/projects/sybil" element={<SybilDemo />} />
          <Route path="/projects/rag" element={<RagDemo />} />
          <Route path="/projects/nexus" element={<NexusDemo />} />
          <Route path="/projects/strand" element={<StrandDemo />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <img className="brand-logo" src="/rember_logo.svg" alt="" width="26" height="26" /> Rember LLC
          </span>
          <span>
            &copy; {new Date().getFullYear()} Rene Ledesma &middot;{' '}
            {site === 'dev' ? 'Software engineering' : 'Owner-operated trucking'}
          </span>
          <a href={other.url} target="_blank" rel="noopener noreferrer" className="footer-cross">
            {other.label} ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
