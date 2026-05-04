import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  LayoutDashboard,
  Wrench,
  Image,
  Users,
  MessageSquare,
  FileText,
  Tag,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ExternalLink,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/admin" },
  { icon: <Users size={18} />, label: "Users", to: "/admin/users" },
  { icon: <Calendar size={18} />, label: "Bookings", to: "/admin/bookings" },
  {
    icon: <MessageSquare size={18} />,
    label: "Messages",
    to: "/admin/messages",
  },
  { icon: <Mail size={18} />, label: "Contact Forms", to: "/admin/contacts" },
  { icon: <Wrench size={18} />, label: "Services", to: "/admin/services" },
  { icon: <Image size={18} />, label: "Portfolio", to: "/admin/portfolio" },
  { icon: <Users size={18} />, label: "Team", to: "/admin/team" },
  {
    icon: <MessageSquare size={18} />,
    label: "Testimonials",
    to: "/admin/testimonials",
  },
  { icon: <BookOpen size={18} />, label: "Blog", to: "/admin/blog" },
  { icon: <Tag size={18} />, label: "Pricing", to: "/admin/pricing" },
  { icon: <Settings size={18} />, label: "Settings", to: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const currentLabel =
    navItems.find((n) =>
      n.to === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(n.to),
    )?.label || "Dashboard";

  return (
    <div className="admin-layout">
      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}
      >
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <TrendingUp size={18} color="var(--brand-gold)" />
            <span>
              Brand<em>Lift</em>
            </span>
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              color: "var(--brand-gold)",
              background: "rgba(230,0,0,0.1)",
              padding: "2px 7px",
              borderRadius: "4px",
            }}
          >
            Admin
          </span>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const active =
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}{" "}
                <span className="admin-nav-item__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
            style={{ marginBottom: "4px" }}
          >
            <Globe size={18} /> View Site <ExternalLink size={12} />
          </a>
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {admin?.name?.[0] || "A"}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "var(--brand-dark)",
                }}
              >
                {admin?.name || "Admin User"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--brand-gray)" }}>
                {admin?.email || "admin@brandlift.com"}
              </div>
            </div>
          </div>
          <button
            className="admin-nav-item"
            onClick={handleLogout}
            style={{
              color: "#e53e3e",
              width: "100%",
              background: "none",
              textAlign: "left",
              marginTop: "4px",
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__toggle"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-topbar__title">{currentLabel}</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
