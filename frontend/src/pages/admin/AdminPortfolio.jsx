import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  title: '',
  category: '',
  description: '',
  imageUrl: '',
  clientName: '',
  projectUrl: '',
  tags: '',
  isFeatured: false,
  isActive: true,
};

export default function AdminPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get('/portfolio').then((response) => {
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
    setForm({ ...item, tags: (item.tags || []).join(', ') });
    setEditing(item._id);
    setModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await api.put(`/portfolio/${editing}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/portfolio', payload);
        toast.success('Created');
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
    if (!confirm('Delete this portfolio item?')) return;

    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const Field = ({ label, children }) => (
    <div className="form-group">
      {label && <label>{label}</label>}
      {children}
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Portfolio ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> Add Item
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Client</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: '52px', height: '36px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>
                      <span className="badge badge-blue">{item.category}</span>
                    </td>
                    <td style={{ color: 'var(--brand-gray)' }}>{item.clientName || '-'}</td>
                    <td>
                      <span style={{ color: item.isFeatured ? '#f5a623' : 'var(--brand-gray)' }}>
                        {item.isFeatured ? 'Yes' : 'No'}
                      </span>
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
                      No portfolio items found.
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
              <h3>{editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
              <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <Field label="Title *">
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                      required
                    />
                  </Field>
                  <Field label="Category *">
                    <input
                      className="form-control"
                      value={form.category}
                      onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                      required
                      placeholder="Web Development"
                    />
                  </Field>
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
                    <label>Image URL *</label>
                    <input
                      className="form-control"
                      value={form.imageUrl}
                      onChange={(event) => setForm((previous) => ({ ...previous, imageUrl: event.target.value }))}
                      required
                      placeholder="https://..."
                    />
                  </div>
                  <Field label="Client Name">
                    <input
                      className="form-control"
                      value={form.clientName}
                      onChange={(event) => setForm((previous) => ({ ...previous, clientName: event.target.value }))}
                    />
                  </Field>
                  <Field label="Project URL">
                    <input
                      className="form-control"
                      value={form.projectUrl}
                      onChange={(event) => setForm((previous) => ({ ...previous, projectUrl: event.target.value }))}
                      placeholder="https://..."
                    />
                  </Field>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Tags (comma-separated)</label>
                    <input
                      className="form-control"
                      value={form.tags}
                      onChange={(event) => setForm((previous) => ({ ...previous, tags: event.target.value }))}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="form-group admin-checkbox-row">
                    <label htmlFor="portfolio-featured" style={{ margin: 0 }}>
                      Featured
                    </label>
                    <input
                      id="portfolio-featured"
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(event) => setForm((previous) => ({ ...previous, isFeatured: event.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                    />
                  </div>
                  <div className="form-group admin-checkbox-row">
                    <label htmlFor="portfolio-active" style={{ margin: 0 }}>
                      Active
                    </label>
                    <input
                      id="portfolio-active"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                    />
                  </div>
                </div>
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius)', marginTop: '4px' }}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                )}
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
