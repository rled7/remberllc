import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hub from './pages/Hub';
import Business from './pages/Business';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import BridgeDemo from './pages/BridgeDemo';

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
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2024 Rene Ledesma · Rember LLC · Built with React + Cloudflare Pages</p>
      </footer>
    </div>
  );
}
