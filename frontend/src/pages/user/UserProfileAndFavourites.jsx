import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "../../utils/api";
import { useUserAuth } from "../../context/UserAuthContext";

export function UserFavourites() {
  const { user, refreshUser } = useUserAuth();
  const [removing, setRemoving] = useState(null);

  const handleRemove = async (serviceId) => {
    setRemoving(serviceId);
    try {
      await userApi.post(`/users/favourites/${serviceId}`);
      await refreshUser();
      toast.success("Removed from favourites");
    } catch {
      toast.error("Failed to remove");
    } finally {
      setRemoving(null);
    }
  };

  const favourites = user?.favourites || [];

  return (
    <div>
      <div className="user-page-header">
        <div>
          <h2 className="user-page-title">Saved Services</h2>
          <p className="user-page-subtitle">
            Keep your shortlisted services in one place.
          </p>
        </div>
      </div>

      {favourites.length === 0 ? (
        <div className="user-empty">
          <Heart
            size={48}
            strokeWidth={1.5}
            style={{ margin: "0 auto 20px", opacity: 0.25 }}
          />
          <h3>No saved services yet</h3>
          <p>
            Browse our services and save the ones you&apos;re interested in.
          </p>
        </div>
      ) : (
        <div className="user-favourites-grid">
          {favourites.map((service) => (
            <div key={service._id} className="user-card favourite-card">
              <div className="favourite-icon">
                <span style={{ fontSize: "2.4rem" }}>
                  {service.icon || "🛠️"}
                </span>
              </div>

              <div className="favourite-content">
                <h4 className="favourite-title">{service.title}</h4>
                <span className="favourite-category">{service.category}</span>
              </div>

              <button
                onClick={() => handleRemove(service._id)}
                disabled={removing === service._id}
                className="remove-btn"
              >
                <Trash2 size={14} />
                {removing === service._id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserProfile() {
  const { user, refreshUser } = useUserAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  const handleProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await userApi.put("/users/profile", form);
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setPwSaving(true);
    try {
      await userApi.put("/users/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="user-page-header">
        <div>
          <h2 className="user-page-title">My Profile</h2>
          <p className="user-page-subtitle">
            Manage your personal information and security.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal Information */}
        <div className="user-card profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          <form onSubmit={handleProfile} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-control"
                value={user?.email || ""}
                disabled
                onClick={() => setShowEmailWarning(true)}
              />
              {showEmailWarning && (
                <span className="field-hint email-warning">
                  Email cannot be changed
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div className="form-group">
              <label>Avatar URL</label>
              <input
                className="form-control"
                value={form.avatar}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, avatar: e.target.value }))
                }
                placeholder="https://example.com/avatar.jpg"
              />
              {form.avatar && (
                <img
                  src={form.avatar}
                  alt="Avatar preview"
                  className="avatar-preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="user-card profile-card">
          <div className="card-header">
            <h3>Change Password</h3>
          </div>
          <form onSubmit={handlePassword} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm((prev) => ({ ...prev, confirm: e.target.value }))
                }
                required
              />
              {pwForm.newPassword && pwForm.confirm && (
                <span
                  className={`password-match ${pwForm.newPassword === pwForm.confirm ? "match" : "no-match"}`}
                >
                  {pwForm.newPassword === pwForm.confirm
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={pwSaving}
            >
              {pwSaving ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
