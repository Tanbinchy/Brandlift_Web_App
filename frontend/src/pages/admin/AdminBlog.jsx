import { useEffect, useState } from 'react';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'BrandLift Team',
  tags: '',
  category: '',
  isPublished: false,
};

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('write');

  const load = () =>
    api.get('/blog/admin/all').then((response) => {
      setItems(response.data.data);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setTab('write');
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, tags: (item.tags || []).join(', ') });
    setEditing(item._id);
    setTab('write');
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
        await api.put(`/blog/${editing}`, payload);
        toast.success('Post updated');
      } else {
        await api.post('/blog', payload);
        toast.success('Post created');
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
    if (!confirm('Delete this blog post?')) return;

    try {
      await api.delete(`/blog/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const changeField = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((previous) => ({ ...previous, title, slug: editing ? previous.slug : slug }));
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Blog Posts ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> New Post
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
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {item.coverImage ? (
                          <img src={item.coverImage} alt="" style={{ width: '52px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                        ) : (
                          <div style={{ width: '52px', height: '36px', background: 'var(--brand-blue)', borderRadius: '6px' }} />
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: '200px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    </td>
                    <td>{item.category ? <span className="badge badge-blue">{item.category}</span> : '-'}</td>
                    <td style={{ color: 'var(--brand-gray)', fontSize: '0.82rem' }}>{item.author}</td>
                    <td>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: item.isPublished ? 'rgba(104,211,145,0.12)' : 'rgba(0,0,0,0.04)',
                          color: item.isPublished ? '#68d391' : 'var(--brand-gray)',
                          border: `1px solid ${item.isPublished ? 'rgba(104,211,145,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        }}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--brand-gray)' }}>{item.views || 0}</td>
                    <td style={{ color: 'var(--brand-gray)', fontSize: '0.8rem' }}>
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <div className="admin-action-row">
                        {item.isPublished && item.slug && (
                          <a href={`/blog/${item.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-dark">
                            <Eye size={13} />
                          </a>
                        )}
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
                      No posts yet. Create your first post.
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
          <div className="admin-modal" style={{ maxWidth: '780px' }}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Post' : 'New Blog Post'}</h3>
              <button style={{ background: 'none', color: 'var(--brand-gray)', padding: '4px' }} onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input className="form-control" value={form.title} onChange={handleTitleChange} required placeholder="Post title" />
                </div>

                <div className="form-group">
                  <label>Slug (auto-generated, editable)</label>
                  <input className="form-control" value={form.slug} onChange={changeField('slug')} placeholder="post-url-slug" />
                </div>

                <div className="form-group">
                  <label>Excerpt *</label>
                  <textarea
                    className="form-control"
                    value={form.excerpt}
                    onChange={changeField('excerpt')}
                    required
                    rows={2}
                    placeholder="Short summary shown in blog list..."
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <label style={{ margin: 0 }}>Content (HTML supported) *</label>
                    <div className="admin-action-row">
                      {['write', 'preview'].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`btn btn-sm ${tab === value ? 'btn-primary' : 'btn-outline'}`}
                          style={{ padding: '4px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
                          onClick={() => setTab(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {tab === 'write' ? (
                    <textarea
                      className="form-control"
                      value={form.content}
                      onChange={changeField('content')}
                      required
                      rows={12}
                      placeholder="<p>Write your post content here. HTML is supported.</p><h2>Section Heading</h2><p>More content...</p>"
                      style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                    />
                  ) : (
                    <div
                      className="admin-preview-box"
                      dangerouslySetInnerHTML={{
                        __html: form.content || '<em style="color:var(--brand-gray)">Nothing to preview yet...</em>',
                      }}
                    />
                  )}
                </div>

                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Cover Image URL</label>
                    <input className="form-control" value={form.coverImage} onChange={changeField('coverImage')} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input className="form-control" value={form.category} onChange={changeField('category')} placeholder="SEO, Social Media..." />
                  </div>
                  <div className="form-group">
                    <label>Author</label>
                    <input className="form-control" value={form.author} onChange={changeField('author')} />
                  </div>
                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input className="form-control" value={form.tags} onChange={changeField('tags')} placeholder="SEO, Marketing, Tips" />
                  </div>
                </div>

                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt="preview"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <div className="form-group admin-checkbox-row">
                  <input
                    type="checkbox"
                    id="blog-published"
                    checked={form.isPublished}
                    onChange={(event) => setForm((previous) => ({ ...previous, isPublished: event.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold)' }}
                  />
                  <label htmlFor="blog-published" style={{ cursor: 'pointer', margin: 0, color: form.isPublished ? '#68d391' : 'var(--brand-gray)' }}>
                    {form.isPublished ? 'Published and visible on site' : 'Draft and hidden from site'}
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : form.isPublished ? 'Save and Publish' : 'Save as Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
