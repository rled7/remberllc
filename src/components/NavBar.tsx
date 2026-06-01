import { NavLink, Link } from 'react-router-dom';
import useScrolled from '../hooks/useScrolled';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/business', label: 'Trucking', end: false },
  { to: '/portfolio', label: 'Portfolio', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

export default function NavBar() {
  const scrolled = useScrolled(20);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img className="brand-logo" src="/rember_logo.svg" alt="" width="34" height="34" />
          Rember&nbsp;LLC
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
      </div>
    </nav>
  );
}
