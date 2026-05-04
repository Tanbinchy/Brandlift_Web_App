import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const PROJECT_STATUSES = [
  "none",
  "pending",
  "in-progress",
  "review",
  "completed",
];
const STATUS_COLOR = {
  none: "var(--brand-gray)",
  pending: "#f5a623",
  "in-progress": "#7eb3ff",
  review: "#b794f4",
  completed: "#68d391",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/users").then((response) => {
      setUsers(response.data.data);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openEdit = (user) => {
    setSelected(user);
    setForm({
      isActive: user.isActive,
      projectStatus: user.projectStatus,
      role: user.role,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put(`/users/${selected._id}`, form);
      toast.success("User updated");
      setSelected(null);
      load();
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Registered Users ({users.length})</h3>
        </div>
        <div className="admin-table-wrap">
          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : (
            <table className="admin-table users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Project Status</th>
                  <th>Active</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(245,166,35,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: "var(--brand-gold)",
                            fontSize: "0.85rem",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            user.name?.[0]
                          )}
                        </div>
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--brand-gray)" }}>{user.email}</td>
                    <td style={{ color: "var(--brand-gray)" }}>
                      {user.phone || "-"}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color:
                            STATUS_COLOR[user.projectStatus] ||
                            "var(--brand-gray)",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.projectStatus || "none"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          color: user.isActive ? "#68d391" : "#fc8181",
                          fontSize: "0.82rem",
                        }}
                      >
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td
                      style={{ color: "var(--brand-gray)", fontSize: "0.8rem" }}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="admin-action-row users-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => openEdit(user)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        color: "var(--brand-gray)",
                        padding: "40px",
                      }}
                    >
                      No registered users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="admin-modal-backdrop"
          onClick={(event) =>
            event.target === event.currentTarget && setSelected(null)
          }
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Edit User: {selected.name}</h3>
              <button
                style={{
                  background: "none",
                  color: "var(--brand-gray)",
                  padding: "4px",
                }}
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body admin-body-stack">
                <div className="admin-note-box">
                  <div
                    style={{ fontSize: "0.82rem", color: "var(--brand-gray)" }}
                  >
                    {selected.email} | Joined{" "}
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="form-group">
                  <label>Project Status</label>
                  <select
                    className="form-control"
                    value={form.projectStatus}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        projectStatus: event.target.value,
                      }))
                    }
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option
                        key={status}
                        value={status}
                        style={{ textTransform: "capitalize" }}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--brand-gray)",
                      marginTop: "4px",
                    }}
                  >
                    This status is shown to the user on their dashboard.
                  </span>
                </div>
                <div className="form-group admin-checkbox-row">
                  <label htmlFor="user-active" style={{ margin: 0 }}>
                    Account Active
                  </label>
                  <input
                    id="user-active"
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
                  <span
                    style={{ fontSize: "0.78rem", color: "var(--brand-gray)" }}
                  >
                    (Uncheck to disable login)
                  </span>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
