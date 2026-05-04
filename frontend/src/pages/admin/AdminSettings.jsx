import { useEffect, useState } from "react";
import { KeyRound, RefreshCw, Save, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const GROUPS = [
  {
    key: "general",
    label: "General",
    fields: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "site_tagline", label: "Tagline", type: "text" },
    ],
  },
  {
    key: "hero",
    label: "Hero Section",
    fields: [
      { key: "hero_title", label: "Hero Title", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
    ],
  },
  {
    key: "about",
    label: "About",
    fields: [
      { key: "about_text", label: "About Description", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Contact Info",
    fields: [
      { key: "phone", label: "Phone Number", type: "text" },
      { key: "email", label: "Email Address", type: "email" },
      { key: "address", label: "Office Address", type: "text" },
    ],
  },
  {
    key: "social",
    label: "Social Media",
    fields: [
      { key: "facebook", label: "Facebook URL", type: "url" },
      { key: "instagram", label: "Instagram URL", type: "url" },
      { key: "linkedin", label: "LinkedIn URL", type: "url" },
      { key: "youtube", label: "YouTube URL", type: "url" },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [pwSaving, setPwSaving] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    api.get("/settings").then((response) => {
      setSettings(response.data);
      setLoading(false);
    });
  }, []);

  const handleChange = (key, value) =>
    setSettings((previous) => ({ ...previous, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/settings", settings);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (pwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPwSaving(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page admin-settings-page">
      {GROUPS.map((group) => (
        <div key={group.key} className="admin-card">
          <div className="admin-card-header">
            <h3>{group.label}</h3>
          </div>
          <div className="admin-card-body admin-body-stack">
            {group.fields.map((field) => (
              <div key={field.key} className="form-group">
                <label>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    value={settings[field.key] || ""}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    className="form-control"
                    type={field.type || "text"}
                    value={settings[field.key] || ""}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="admin-save-row admin-settings-action-row">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "1rem" }}
        >
          {saving ? (
            <>
              <RefreshCw size={18} className="spin-icon" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save All Settings
            </>
          )}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>
            <KeyRound
              size={16}
              style={{
                display: "inline",
                marginRight: "6px",
                verticalAlign: "middle",
              }}
            />
            Change Password
          </h3>
        </div>
        <form onSubmit={handlePasswordChange}>
          <div className="admin-card-body admin-body-stack">
            <div 
              className="admin-note-box" 
              style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                gap: "12px", 
                padding: "16px",
                backgroundColor: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{
                background: "rgba(230, 0, 0, 0.1)",
                color: "var(--brand-primary)",
                padding: "10px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <User size={20} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--brand-gray)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Logged In Admin</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <strong style={{ color: "var(--brand-dark)", fontSize: "1.05rem" }}>{admin?.name}</strong>
                  <span style={{ color: "var(--brand-gray)", fontSize: "0.9rem" }}>({admin?.email})</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Current Password</label>
              <input
                className="form-control"
                type="password"
                value={pwForm.currentPassword}
                onChange={(event) =>
                  setPwForm((previous) => ({
                    ...previous,
                    currentPassword: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>New Password</label>
                <input
                  className="form-control"
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(event) =>
                    setPwForm((previous) => ({
                      ...previous,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  className="form-control"
                  type="password"
                  value={pwForm.confirm}
                  onChange={(event) =>
                    setPwForm((previous) => ({
                      ...previous,
                      confirm: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            {pwForm.newPassword && pwForm.confirm && (
              <div
                style={{
                  fontSize: "0.82rem",
                  color:
                    pwForm.newPassword === pwForm.confirm
                      ? "#68d391"
                      : "#fc8181",
                }}
              >
                {pwForm.newPassword === pwForm.confirm
                  ? "Passwords match"
                  : "Passwords do not match"}
              </div>
            )}
          </div>
          <div className="admin-modal-footer admin-settings-action-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pwSaving}
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "1rem" }}
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
