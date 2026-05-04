import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  title: '',
  category: 'Digital Marketing',
  description: '',
  icon: '⚡',
  features: '',
  isActive: true,
  order: 0,
};

const CATEGORIES = ['Digital Marketing', 'Visual & Communication', 'Tech Solution'];

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get('/services').then((response) => {
      setItems(response.data.data);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, features: (item.features || []).join(', ') });
    setEditing(item._id);
    setModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      features: form.features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await api.put(`/services/${editing}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', payload);
        toast.success('Service created');
      }
      setModal(false);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;

    try {
      await api.delete(`/services/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Services ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> Add Service
            </button>
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
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontSize: '1.4rem' }}>{item.icon}</td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>
                      <span className="badge badge-blue">{item.category}</span>
                    </td>
                    <td>{item.order}</td>
                    <td>
                      <span style={{ color: item.isActive ? '#68d391' : '#fc8181' }}>{item.isActive ? 'Yes' : 'No'}</span>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)}>
                          <Pencil size={13} />
                        </button>
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
                      No services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="admin-modal-backdrop" onClick={(event) => event.target === event.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Service' : 'Add Service'}</h3>
              <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Title *</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                      required
                      placeholder="Service title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-control"
                      value={form.category}
                      onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Icon (emoji)</label>
                    <input
                      className="form-control"
                      value={form.icon}
                      onChange={(event) => setForm((previous) => ({ ...previous, icon: event.target.value }))}
                      placeholder="⚡"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Description *</label>
                    <textarea
                      className="form-control"
                      value={form.description}
                      onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Features (comma-separated)</label>
                    <input
                      className="form-control"
                      value={form.features}
                      onChange={(event) => setForm((previous) => ({ ...previous, features: event.target.value }))}
                      placeholder="SEO Audit, Keyword Research, Link Building"
                    />
                  </div>
                  <div className="form-group">
                    <label>Order</label>
                    <input
                      className="form-control"
                      type="number"
                      value={form.order}
                      onChange={(event) => setForm((previous) => ({ ...previous, order: Number(event.target.value) }))}
                    />
                  </div>
                  <div className="form-group admin-checkbox-row" style={{ justifyContent: 'flex-end' }}>
                    <label htmlFor="service-active" style={{ margin: 0 }}>
                      Active
                    </label>
                    <input
                      id="service-active"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
