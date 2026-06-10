import { NavLink, Link } from 'react-router-dom';
import useScrolled from '../hooks/useScrolled';
import { OTHER_SITE, type Site } from '../site';

const DEV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Projects', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

const BIZ_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/business', label: 'Trucking', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

export default function NavBar({ site }: { site: Site }) {
  const scrolled = useScrolled(20);
  const links = site === 'dev' ? DEV_LINKS : BIZ_LINKS;
  const other = OTHER_SITE[site];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img className="brand-logo" src="/rember_logo.svg" alt="" width="34" height="34" />
          {site === 'dev' ? 'Rene Ledesma' : 'Rember LLC'}
        </Link>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
        <a className="nav-link nav-cross" href={other.url} target="_blank" rel="noopener noreferrer">
          {other.label} ↗
        </a>
      </div>
    </nav>
  );
}
