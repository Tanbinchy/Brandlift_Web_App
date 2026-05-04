import { useEffect, useState } from 'react';
import { Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  name: '',
  price: '',
  currency: 'BDT',
  period: 'month',
  description: '',
  features: '',
  category: '',
  isPopular: false,
  isActive: true,
  order: 0,
};

export default function AdminPricing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get('/pricing').then((response) => {
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
    setForm({ ...item, features: (item.features || []).join('\n') });
    setEditing(item._id);
    setModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      order: Number(form.order),
      features: form.features
        .split('\n')
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await api.put(`/pricing/${editing}`, payload);
        toast.success('Plan updated');
      } else {
        await api.post('/pricing', payload);
        toast.success('Plan created');
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
    if (!confirm('Delete this pricing plan?')) return;

    try {
      await api.delete(`/pricing/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const changeField = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Pricing Plans ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> Add Plan
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
                  <th>Name</th>
                  <th>Price</th>
                  <th>Period</th>
                  <th>Category</th>
                  <th>Popular</th>
                  <th>Active</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ color: 'var(--brand-gold)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      BDT {Number(item.price).toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--brand-gray)' }}>/{item.period}</td>
                    <td>{item.category ? <span className="badge badge-blue">{item.category}</span> : '-'}</td>
                    <td>
                      {item.isPopular ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-gold)', fontSize: '0.82rem' }}>
                          <Star size={13} fill="currentColor" /> Popular
                        </span>
                      ) : (
                        <span style={{ color: 'var(--brand-gray)', fontSize: '0.82rem' }}>No</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: item.isActive ? '#68d391' : '#fc8181' }}>{item.isActive ? 'Yes' : 'No'}</span>
                    </td>
                    <td>{item.order}</td>
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
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--brand-gray)', padding: '40px' }}>
                      No pricing plans yet.
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
              <h3>{editing ? 'Edit Plan' : 'Add Pricing Plan'}</h3>
              <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Plan Name *</label>
                    <input className="form-control" value={form.name} onChange={changeField('name')} required placeholder="Starter / Growth / Enterprise" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input className="form-control" value={form.category} onChange={changeField('category')} placeholder="Digital Marketing" />
                  </div>
                  <div className="form-group">
                    <label>Price (BDT) *</label>
                    <input className="form-control" type="number" value={form.price} onChange={changeField('price')} required min={0} placeholder="5000" />
                  </div>
                  <div className="form-group">
                    <label>Billing Period</label>
                    <select className="form-control" value={form.period} onChange={changeField('period')}>
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                      <option value="project">Per Project</option>
                      <option value="one-time">One Time</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Short Description</label>
                    <input className="form-control" value={form.description} onChange={changeField('description')} placeholder="Perfect for small businesses..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Features (one per line)</label>
                    <textarea
                      className="form-control"
                      value={form.features}
                      onChange={changeField('features')}
                      rows={6}
                      placeholder={'Social Media Management (2 platforms)\n8 posts per month\nBasic SEO\nMonthly Report'}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-gray)', marginTop: '4px' }}>
                      Each line becomes a separate feature bullet point.
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input className="form-control" type="number" value={form.order} onChange={changeField('order')} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                    <div className="form-group admin-checkbox-row" style={{ margin: 0 }}>
                      <input
                        type="checkbox"
                        id="pricing-popular"
                        checked={form.isPopular}
                        onChange={(event) => setForm((previous) => ({ ...previous, isPopular: event.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                      />
                      <label htmlFor="pricing-popular" style={{ cursor: 'pointer', margin: 0 }}>
                        Mark as Popular
                      </label>
                    </div>
                    <div className="form-group admin-checkbox-row" style={{ margin: 0 }}>
                      <input
                        type="checkbox"
                        id="pricing-active"
                        checked={form.isActive}
                        onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                      />
                      <label htmlFor="pricing-active" style={{ cursor: 'pointer', margin: 0 }}>
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
