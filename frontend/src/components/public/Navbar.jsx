import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, LogOut, Menu, TrendingUp, User, X } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useUserAuth();
  const favouritesCount = (user?.favourites || []).length;
  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userMenu) return;

    const onPointerDown = (event) => {
      if (!accountRef.current) return;
      if (accountRef.current.contains(event.target)) return;
      setUserMenu(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setUserMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [userMenu]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (mobileToggleRef.current?.contains(event.target)) return;
      if (mobileMenuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
  }, [location]);

  useEffect(() => {
    if (!open) setUserMenu(false);
  }, [open]);

  const closeMenus = () => {
    setOpen(false);
    setUserMenu(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <TrendingUp size={22} color="var(--brand-gold)" />
          <span>Brand<em>Lift</em></span>
        </Link>

        <ul ref={mobileMenuRef} className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to} className={`navbar__link ${location.pathname === link.to ? 'active' : ''}`} onClick={closeMenus}>
                {link.label}
                {isAuthenticated && link.to === '/services' && favouritesCount > 0 && (
                  <span className="navbar__link-badge" aria-label={`Saved services: ${favouritesCount}`}>
                    {favouritesCount}
                  </span>
                )}
              </Link>
            </li>
          ))}

          <li className="navbar__account-slot">
            {isAuthenticated ? (
              <div className="navbar__account" ref={accountRef}>
                <button
                  onClick={() => setUserMenu(prev => !prev)}
                  className="navbar__account-trigger"
                  aria-expanded={userMenu}
                  aria-label="Open profile menu"
                >
                  <div className="navbar__account-avatar">{user?.name?.[0] || 'U'}</div>
                  <span className="navbar__account-name">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>

                {userMenu && (
                  <div className="navbar__account-menu">
                    <Link to="/dashboard" className="navbar__account-item" onClick={closeMenus}>
                      <LayoutDashboard size={14} /> My Dashboard
                    </Link>
                    <Link to="/dashboard/favourites" className="navbar__account-item" onClick={closeMenus}>
                      <Heart size={14} /> Saved Services
                    </Link>
                    <Link to="/dashboard/profile" className="navbar__account-item" onClick={closeMenus}>
                      <User size={14} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        closeMenus();
                        logout();
                      }}
                      className="navbar__account-item navbar__account-item--danger"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenus}>Login</Link>
                <Link to="/contact" className="btn btn-primary btn-sm" onClick={closeMenus}>Get Quote</Link>
              </>
            )}
          </li>
        </ul>

        <button ref={mobileToggleRef} className="navbar__toggle" onClick={() => setOpen(prev => !prev)} aria-label="menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
