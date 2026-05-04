import { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Image,
  Mail,
  MessageSquare,
  Tag,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StatBox = ({ icon, label, value, to, color = 'var(--brand-gold)', badge }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div
      className="admin-card"
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'var(--transition)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = `${color}40`;
        event.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
        event.currentTarget.style.transform = 'none';
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--brand-dark)',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--brand-gray)', marginTop: '3px' }}>
          {label}
        </div>
      </div>
      {badge > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: color,
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '1px 7px',
          }}
        >
          {badge} new
        </div>
      )}
    </div>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/services'),
      api.get('/portfolio'),
      api.get('/team'),
      api.get('/blog/admin/all'),
      api.get('/contacts'),
      api.get('/pricing'),
      api.get('/users'),
      api.get('/bookings'),
      api.get('/messages'),
    ])
      .then(([servicesRes, portfolioRes, teamRes, blogRes, contactsRes, pricingRes, usersRes, bookingsRes, messagesRes]) => {
        setStats({
          services: servicesRes.data.total,
          portfolio: portfolioRes.data.total,
          team: teamRes.data.total,
          blog: blogRes.data.total,
          contacts: contactsRes.data.total,
          pricing: pricingRes.data.total,
          users: usersRes.data.total,
          bookings: bookingsRes.data.total,
          messages: messagesRes.data.total,
          newContacts: contactsRes.data.data.filter((item) => item.status === 'new').length,
          newBookings: bookingsRes.data.data.filter((item) => item.status === 'pending').length,
          newMessages: messagesRes.data.data.filter((item) => !item.isReadByAdmin).length,
        });
        setContacts(contactsRes.data.data.slice(0, 5));
        setBookings(bookingsRes.data.data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-intro">
        <h2>Dashboard Overview</h2>
        <p>Manage bookings, clients, content, and communication from one place.</p>
      </div>

      <section>
        <div className="admin-section-label">Needs Attention</div>
        <div className="admin-grid-3">
          <StatBox
            icon={<Calendar size={20} />}
            label="Pending Bookings"
            value={stats.newBookings || 0}
            to="/admin/bookings"
            color="#f5a623"
            badge={stats.newBookings}
          />
          <StatBox
            icon={<MessageSquare size={20} />}
            label="Unread Messages"
            value={stats.newMessages || 0}
            to="/admin/messages"
            color="#7eb3ff"
            badge={stats.newMessages}
          />
          <StatBox
            icon={<Mail size={20} />}
            label="New Contact Forms"
            value={stats.newContacts || 0}
            to="/admin/contacts"
            color="#fc8181"
            badge={stats.newContacts}
          />
        </div>
      </section>

      <section>
        <div className="admin-section-label">Site Content</div>
        <div className="grid-4" style={{ gap: '14px' }}>
          <StatBox icon={<Users size={20} />} label="Registered Users" value={stats.users || 0} to="/admin/users" color="#68d391" />
          <StatBox icon={<Calendar size={20} />} label="Total Bookings" value={stats.bookings || 0} to="/admin/bookings" color="#f5a623" />
          <StatBox icon={<Wrench size={20} />} label="Services" value={stats.services || 0} to="/admin/services" color="var(--brand-gold)" />
          <StatBox icon={<Image size={20} />} label="Portfolio Items" value={stats.portfolio || 0} to="/admin/portfolio" color="#7eb3ff" />
          <StatBox icon={<BookOpen size={20} />} label="Blog Posts" value={stats.blog || 0} to="/admin/blog" color="#f687b3" />
          <StatBox icon={<Tag size={20} />} label="Pricing Plans" value={stats.pricing || 0} to="/admin/pricing" color="#b794f4" />
          <StatBox icon={<Users size={20} />} label="Team Members" value={stats.team || 0} to="/admin/team" color="#68d391" />
          <StatBox icon={<TrendingUp size={20} />} label="Contact Forms" value={stats.contacts || 0} to="/admin/contacts" color="#fc8181" />
        </div>
      </section>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Bookings</h3>
            <Link to="/admin/bookings" style={{ fontSize: '0.82rem', color: 'var(--brand-gold)' }}>
              View All
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const colors = {
                    pending: '#f5a623',
                    confirmed: '#7eb3ff',
                    'in-progress': '#b794f4',
                    completed: '#68d391',
                    cancelled: '#fc8181',
                  };

                  return (
                    <tr key={booking._id}>
                      <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{booking.user?.name || 'Unknown'}</td>
                      <td style={{ fontSize: '0.82rem' }}>{booking.serviceName}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            background: `${colors[booking.status]}15`,
                            color: colors[booking.status],
                            border: `1px solid ${colors[booking.status]}30`,
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--brand-gray)', padding: '24px' }}>
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Contact Forms</h3>
            <Link to="/admin/contacts" style={{ fontSize: '0.82rem', color: 'var(--brand-gold)' }}>
              View All
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{contact.name}</td>
                    <td style={{ fontSize: '0.82rem' }}>{contact.subject}</td>
                    <td>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: contact.status === 'new' ? 'rgba(230,0,0,0.1)' : 'rgba(0,0,0,0.06)',
                          color: contact.status === 'new' ? 'var(--brand-gold)' : 'var(--brand-gray)',
                          border: `1px solid ${contact.status === 'new' ? 'rgba(230,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`,
                        }}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--brand-gray)', padding: '24px' }}>
                      No contacts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
