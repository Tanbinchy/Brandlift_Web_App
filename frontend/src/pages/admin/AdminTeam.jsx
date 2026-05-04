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
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  email: "",
  linkedin: "",
  facebook: "",
  order: 0,
  isActive: true,
};

export default function AdminTeam() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/team").then((response) => {
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
        await api.put(`/team/${editing}`, form);
        toast.success("Updated");
      } else {
        await api.post("/team", form);
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
    if (!confirm("Delete this team member?")) return;

    try {
      await api.delete(`/team/${id}`);
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
          <h3>Team Members ({items.length})</h3>
          <div className="admin-card-header__actions">
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={15} /> Add Member
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : (
            <table className="admin-table team-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "var(--brand-blue)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "var(--brand-gold)",
                            }}
                          >
                            {item.name?.[0] || "T"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ color: "var(--brand-gray)" }}>{item.role}</td>
                    <td>{item.order}</td>
                    <td>
                      <span
                        style={{ color: item.isActive ? "#68d391" : "#fc8181" }}
                      >
                        {item.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-row team-actions">
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
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div
          className="admin-modal-backdrop"
          onClick={(event) =>
            event.target === event.currentTarget && setModal(false)
          }
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? "Edit Member" : "Add Member"}</h3>
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
                    <label>Name *</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={changeField("name")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role *</label>
                    <input
                      className="form-control"
                      value={form.role}
                      onChange={changeField("role")}
                      required
                      placeholder="CEO & Founder"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Bio</label>
                    <textarea
                      className="form-control"
                      value={form.bio}
                      onChange={changeField("bio")}
                      rows={3}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Photo URL</label>
                    <input
                      className="form-control"
                      value={form.imageUrl}
                      onChange={changeField("imageUrl")}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={form.email}
                      onChange={changeField("email")}
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                      className="form-control"
                      value={form.linkedin}
                      onChange={changeField("linkedin")}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Facebook URL</label>
                    <input
                      className="form-control"
                      value={form.facebook}
                      onChange={changeField("facebook")}
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input
                      className="form-control"
                      type="number"
                      value={form.order}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          order: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="form-group admin-checkbox-row">
                    <label htmlFor="team-active" style={{ margin: 0 }}>
                      Active
                    </label>
                    <input
                      id="team-active"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          isActive: event.target.checked,
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
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginTop: "4px",
                    }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
