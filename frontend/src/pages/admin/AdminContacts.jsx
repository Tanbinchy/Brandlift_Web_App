import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Phone, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUS_COLORS = {
  new: { bg: 'rgba(245,166,35,0.12)', color: 'var(--brand-gold)', border: 'rgba(245,166,35,0.3)' },
  read: { bg: 'rgba(126,179,255,0.1)', color: '#7eb3ff', border: 'rgba(126,179,255,0.25)' },
  replied: { bg: 'rgba(104,211,145,0.1)', color: '#68d391', border: 'rgba(104,211,145,0.3)' },
  closed: { bg: 'rgba(0,0,0,0.04)', color: 'var(--brand-gray)', border: 'rgba(0,0,0,0.08)' },
};

const Badge = ({ status }) => {
  const style = STATUS_COLORS[status] || STATUS_COLORS.new;

  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '0.72rem',
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
};

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [note, setNote] = useState('');

  const load = async () => {
    const url = filter === 'all' ? '/contacts' : `/contacts?status=${filter}`;
    const response = await api.get(url);
    setItems(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const openDetail = async (item) => {
    const response = await api.get(`/contacts/${item._id}`);
    setSelected(response.data);
    setNote(response.data.note || '');
    load();
  };

  const updateStatus = async (status) => {
    try {
      const response = await api.put(`/contacts/${selected._id}`, { status, note });
      setSelected(response.data);
      toast.success(`Status updated to ${status}`);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const saveNote = async () => {
    try {
      await api.put(`/contacts/${selected._id}`, { note });
      toast.success('Note saved');
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;

    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Deleted');
      setSelected(null);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const newCount = items.filter((item) => item.status === 'new').length;
  const splitViewClassName = `admin-split-view${selected ? '' : ' admin-split-view--single'}`;

  return (
    <div className={splitViewClassName}>
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-header__meta">
            <h3>Contact Messages ({items.length})</h3>
            {newCount > 0 && <span className="badge badge-gold">{newCount} new</span>}
          </div>
          <div className="admin-card-header__actions">
            {['all', 'new', 'read', 'replied', 'closed'].map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} onClick={() => openDetail(item)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: item.status === 'new' ? 700 : 400 }}>{item.name}</td>
                    <td style={{ color: 'var(--brand-gray)', fontSize: '0.85rem' }}>{item.email}</td>
                    <td>
                      <div style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.subject}
                      </div>
                    </td>
                    <td>
                      <Badge status={item.status} />
                    </td>
                    <td style={{ color: 'var(--brand-gray)', fontSize: '0.8rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <div className="admin-action-row">
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--brand-gray)', padding: '40px' }}>
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="admin-card admin-side-panel">
          <div className="admin-card-header">
            <h3>Message Detail</h3>
            <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setSelected(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="admin-card-body admin-body-stack">
            <div className="admin-action-row">
              {['new', 'read', 'replied', 'closed'].map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm ${selected.status === status ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '4px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
                  onClick={() => updateStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="admin-note-box admin-note-box--spacious">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <MessageSquare size={14} color="var(--brand-gold)" />
                <strong>{selected.name}</strong>
                <Badge status={selected.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--brand-gray)', flexWrap: 'wrap' }}>
                <Mail size={13} />
                <a href={`mailto:${selected.email}`} style={{ color: 'var(--brand-gold)' }}>
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--brand-gray)', flexWrap: 'wrap' }}>
                  <Phone size={13} />
                  {selected.phone}
                </div>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-gray)' }}>{new Date(selected.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--brand-gray)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                Subject
              </div>
              <div style={{ fontWeight: 600, color: 'var(--brand-dark)' }}>{selected.subject}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--brand-gray)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Message
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 'var(--radius)',
                  padding: '14px',
                  color: 'var(--brand-dark)',
                  fontSize: '0.9rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selected.message}
              </div>
            </div>

            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
              className="btn btn-outline btn-sm"
              style={{ textAlign: 'center', justifyContent: 'center' }}
            >
              <Mail size={14} /> Reply via Email
            </a>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--brand-gray)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Internal Note
              </div>
              <textarea
                className="form-control"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add a private note about this contact..."
              />
              <button className="btn btn-outline btn-sm" style={{ marginTop: '8px' }} onClick={saveNote}>
                Save Note
              </button>
            </div>

            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected._id)} style={{ justifyContent: 'center' }}>
              <Trash2 size={14} /> Delete Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
