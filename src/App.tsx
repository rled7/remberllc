import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hub from './pages/Hub';
import Business from './pages/Business';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import BridgeDemo from './pages/BridgeDemo';
import SybilDemo from './pages/SybilDemo';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/business" element={<Business />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects/bridge" element={<BridgeDemo />} />
          <Route path="/projects/sybil" element={<SybilDemo />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <img className="brand-logo" src="/rember_logo.svg" alt="" width="26" height="26" /> Rember LLC
          </span>
          <span>&copy; {new Date().getFullYear()} Rene Ledesma &middot; Owner-operated trucking &amp; software</span>
          <a href="https://github.com/rled7" target="_blank" rel="noopener noreferrer">
            github.com/rled7
          </a>
        </div>
      </footer>
    </div>
  );
}
