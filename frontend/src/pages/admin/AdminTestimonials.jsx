import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const EMPTY = {
  clientName: "",
  clientRole: "",
  clientCompany: "",
  clientImage: "",
  message: "",
  rating: 5,
  isFeatured: false,
  isActive: true,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/testimonials").then((response) => {
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
    setForm(item);
    setEditing(item._id);
    setModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await api.put(`/testimonials/${editing}`, form);
        toast.success("Updated");
      } else {
        await api.post("/testimonials", form);
        toast.success("Created");
      }
      setModal(false);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      await api.delete(`/testimonials/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  const changeField = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Testimonials ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> Add Testimonial
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : (
            <table className="admin-table testimonials-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 600 }}>{item.clientName}</td>
                    <td style={{ color: "var(--brand-gray)" }}>
                      {item.clientCompany || "-"}
                    </td>
                    <td style={{ color: "var(--brand-gold)" }}>
                      {item.rating}/5
                    </td>
                    <td>
                      <span
                        style={{
                          color: item.isFeatured
                            ? "#f5a623"
                            : "var(--brand-gray)",
                          fontWeight: 500,
                        }}
                      >
                        {item.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          color: "var(--brand-gray)",
                          fontSize: "0.82rem",
                          maxWidth: "250px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          whiteSpace: "normal"
                        }}
                      >
                        {item.message}
                      </div>
                    </td>
                    <td>
                      <div className="admin-action-row testimonials-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        color: "var(--brand-gray)",
                        padding: "40px",
                      }}
                    >
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="admin-modal-backdrop"
          onClick={(event) =>
            event.target === event.currentTarget && setModal(false)
          }
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button
                style={{
                  background: "none",
                  color: "var(--brand-gray)",
                  padding: "4px",
                }}
                onClick={() => setModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Client Name *</label>
                    <input
                      className="form-control"
                      value={form.clientName}
                      onChange={changeField("clientName")}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role / Position</label>
                    <input
                      className="form-control"
                      value={form.clientRole}
                      onChange={changeField("clientRole")}
                      placeholder="CEO / Founder"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      className="form-control"
                      value={form.clientCompany}
                      onChange={changeField("clientCompany")}
                    />
                  </div>

                  <div className="form-group">
                    <label>Rating (1-5)</label>
                    <select
                      className="form-control"
                      value={form.rating}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          rating: Number(e.target.value),
                        }))
                      }
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} Star{value > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Client Photo URL</label>
                    <input
                      className="form-control"
                      value={form.clientImage}
                      onChange={changeField("clientImage")}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Message *</label>
                    <textarea
                      className="form-control"
                      value={form.message}
                      onChange={changeField("message")}
                      required
                      rows={5}
                    />
                  </div>

                  <div className="form-group admin-checkbox-row">
                    <label htmlFor="testimonial-featured" style={{ margin: 0 }}>
                      Featured
                    </label>
                    <input
                      id="testimonial-featured"
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--brand-gold)",
                      }}
                    />
                  </div>

                  <div className="form-group admin-checkbox-row">
                    <label htmlFor="testimonial-active" style={{ margin: 0 }}>
                      Active
                    </label>
                    <input
                      id="testimonial-active"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--brand-gold)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
