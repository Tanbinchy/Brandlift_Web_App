import { useEffect, useState } from 'react';
import { FileText, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
const STATUS_COLORS = {
  pending: '#f5a623',
  confirmed: '#7eb3ff',
  'in-progress': '#b794f4',
  completed: '#68d391',
  cancelled: '#fc8181',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    const url = filter === 'all' ? '/bookings' : `/bookings?status=${filter}`;
    api.get(url).then((response) => {
      setBookings(response.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const openEdit = (booking) => {
    setSelected(booking);
    setForm({
      status: booking.status,
      adminNote: booking.adminNote || '',
      invoiceAmount: booking.invoice?.amount || '',
      invoiceNo: booking.invoice?.invoiceNo || '',
      isPaid: booking.invoice?.isPaid || false,
      paidAt: booking.invoice?.paidAt ? new Date(booking.invoice.paidAt).toISOString().split('T')[0] : '',
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      status: form.status,
      adminNote: form.adminNote,
      invoice: form.invoiceAmount
        ? {
            amount: Number(form.invoiceAmount),
            invoiceNo: form.invoiceNo,
            isPaid: form.isPaid,
            paidAt: form.isPaid && form.paidAt ? new Date(form.paidAt) : null,
          }
        : undefined,
    };

    try {
      await api.put(`/bookings/${selected._id}`, payload);
      toast.success('Booking updated');
      setSelected(null);
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return;

    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const newCount = bookings.filter((booking) => booking.status === 'pending').length;

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-header__meta">
            <h3>Bookings ({bookings.length})</h3>
            {newCount > 0 && <span className="badge badge-gold">{newCount} pending</span>}
          </div>
          <div className="admin-card-header__actions">
            {['all', ...STATUSES].map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem', textTransform: 'capitalize' }}
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
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date and Time</th>
                  <th>Status</th>
                  <th>Invoice</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{booking.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-gray)' }}>{booking.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{booking.serviceName}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--brand-gray)' }}>
                      {new Date(booking.date).toLocaleDateString()} {booking.time}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: `${STATUS_COLORS[booking.status]}15`,
                          color: STATUS_COLORS[booking.status],
                          border: `1px solid ${STATUS_COLORS[booking.status]}30`,
                        }}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.invoice?.amount ? (
                        <span
                          style={{
                            fontSize: '0.82rem',
                            color: booking.invoice.isPaid ? '#68d391' : '#f5a623',
                            fontWeight: 600,
                          }}
                        >
                          BDT {booking.invoice.amount.toLocaleString()} {booking.invoice.isPaid ? '(Paid)' : '(Unpaid)'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--brand-gray)', fontSize: '0.78rem' }}>Not set</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(booking)}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(booking._id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--brand-gray)', padding: '40px' }}>
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={(event) => event.target === event.currentTarget && setSelected(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Manage Booking</h3>
              <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-note-box">
                  <div style={{ fontWeight: 600, color: 'var(--brand-dark)' }}>
                    {selected.user?.name} | {selected.serviceName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-gray)' }}>
                    {new Date(selected.date).toLocaleDateString()} at {selected.time}
                  </div>
                  {selected.message && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--brand-gray)', fontStyle: 'italic', marginTop: '4px' }}>
                      "{selected.message}"
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Booking Status</label>
                  <select
                    className="form-control"
                    value={form.status}
                    onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status} style={{ textTransform: 'capitalize' }}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Admin Note (shown to client)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.adminNote}
                    onChange={(event) => setForm((previous) => ({ ...previous, adminNote: event.target.value }))}
                    placeholder="Confirmation details, meeting link, requirements..."
                  />
                </div>

                <div className="admin-body-stack" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={15} color="var(--brand-gold)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>Invoice</span>
                  </div>

                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label>Amount (BDT)</label>
                      <input
                        className="form-control"
                        type="number"
                        value={form.invoiceAmount}
                        onChange={(event) => setForm((previous) => ({ ...previous, invoiceAmount: event.target.value }))}
                        placeholder="0"
                        min={0}
                      />
                    </div>
                    <div className="form-group">
                      <label>Invoice Number</label>
                      <input
                        className="form-control"
                        value={form.invoiceNo}
                        onChange={(event) => setForm((previous) => ({ ...previous, invoiceNo: event.target.value }))}
                        placeholder="INV-001"
                      />
                    </div>
                  </div>

                  <div className="admin-checkbox-row">
                    <div className="form-group admin-checkbox-row" style={{ margin: 0 }}>
                      <input
                        type="checkbox"
                        id="paid"
                        checked={form.isPaid}
                        onChange={(event) => setForm((previous) => ({ ...previous, isPaid: event.target.checked }))}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--brand-gold)' }}
                      />
                      <label htmlFor="paid" style={{ cursor: 'pointer', margin: 0 }}>
                        Mark as Paid
                      </label>
                    </div>
                    {form.isPaid && (
                      <div className="form-group" style={{ flex: 1, minWidth: '220px' }}>
                        <label>Payment Date</label>
                        <input
                          className="form-control"
                          type="date"
                          value={form.paidAt}
                          onChange={(event) => setForm((previous) => ({ ...previous, paidAt: event.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
