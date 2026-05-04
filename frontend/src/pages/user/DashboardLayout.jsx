import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, FileText, Heart, User, LogOut, Menu, X, TrendingUp, Globe, ExternalLink } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import './DashboardLayout.css';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview', to: '/dashboard' },
  { icon: <Calendar size={18} />, label: 'My Bookings', to: '/dashboard/bookings' },
  { icon: <MessageSquare size={18} />, label: 'Messages', to: '/dashboard/messages' },
  { icon: <FileText size={18} />, label: 'Invoices', to: '/dashboard/invoices' },
  { icon: <Heart size={18} />, label: 'Favourites', to: '/dashboard/favourites' },
  { icon: <User size={18} />, label: 'Profile', to: '/dashboard/profile' },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLabel = navItems.find(item =>
    item.to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.to)
  )?.label || 'Overview';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-layout">
      <aside className={`user-sidebar ${open ? 'user-sidebar--open' : ''}`}>
        <div className="user-sidebar__header">
          <div className="user-sidebar__logo">
            <TrendingUp size={18} color="var(--brand-gold)" />
            <span>Brand<em>Lift</em></span>
          </div>
          <span className="user-sidebar__badge">Client</span>
        </div>

        <nav className="user-sidebar__nav">
          {navItems.map(item => {
            const active = item.to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`user-nav-item ${active ? 'active' : ''}`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="user-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="user-nav-item" style={{ marginBottom: '4px' }}>
            <Globe size={18} /> View Site <ExternalLink size={12} />
          </a>
          <div className="user-sidebar__user">
            <div className="user-sidebar__avatar">{user?.name?.[0] || 'U'}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="user-sidebar__name">{user?.name || 'Client User'}</div>
              <div className="user-sidebar__email">{user?.email || 'client@brandlift.com'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="user-nav-item" style={{ color: '#e53e3e', width: '100%', background: 'none', textAlign: 'left' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="user-overlay" onClick={() => setOpen(false)} />}

      <div className="user-main">
        <header className="user-topbar">
          <button onClick={() => setOpen(prev => !prev)} className="user-topbar__toggle">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="user-topbar__title">{currentLabel}</span>
        </header>

        <div className="user-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
