import { NavLink, Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          rember<span>llc</span>
        </Link>
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Home
        </NavLink>
        <NavLink
          to="/business"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Trucking
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}
