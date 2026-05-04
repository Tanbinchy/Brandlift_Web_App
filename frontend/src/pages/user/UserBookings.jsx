import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Plus, X, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "../../utils/api";
import api from "../../utils/api";

const STATUS_COLORS = {
  pending: {
    color: "#f5a623",
    bg: "rgba(245,166,35,0.1)",
    border: "rgba(245,166,35,0.3)",
  },
  confirmed: {
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
    border: "rgba(37,99,235,0.3)",
  },
  "in-progress": {
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
  },
  completed: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
    border: "rgba(22,163,74,0.3)",
  },
  cancelled: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
  },
};

const formatCurrency = (amount) =>
  `BDT ${Number(amount || 0).toLocaleString()}`;

function StatusBadge({ status }) {
  const tone = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "0.72rem",
        fontWeight: 600,
        background: tone.bg,
        color: tone.color,
        border: `1px solid ${tone.border}`,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

function NewBookingForm() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/services")
      .then((response) => setServices(response.data.data || []));
  }, []);

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await userApi.post("/bookings", form);
      toast.success("Booking submitted! We will confirm shortly.");
      navigate("/dashboard/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <Link
          to="/dashboard/bookings"
          style={{
            color: "var(--brand-gray)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.88rem",
          }}
        >
          <ChevronLeft size={16} /> Back
        </Link>
        <h2 className="user-page-title">Book a Service</h2>
      </div>

      <div style={{ maxWidth: "560px" }}>
        <div className="user-card">
          <div style={{ padding: "20px" }}>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div className="form-group">
                <label>Select Service *</label>
                <select
                  className="form-control"
                  value={form.service}
                  onChange={(event) => {
                    const selectedService = services.find(
                      (service) => service._id === event.target.value,
                    );
                    setForm((prev) => ({
                      ...prev,
                      service: event.target.value,
                      serviceName: selectedService?.title || "",
                    }));
                  }}
                  required
                >
                  <option value="">Choose a service...</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.icon} {service.title} - {service.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-form-grid">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    className="form-control"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <select
                    className="form-control"
                    value={form.time}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    required
                  >
                    <option value="">Select time...</option>
                    {times.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Message</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.message}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  placeholder="Describe your project requirements, goals, budget, etc."
                />
              </div>

              <div
                style={{
                  padding: "14px",
                  background: "rgba(245,166,35,0.06)",
                  border: "1px solid rgba(245,166,35,0.15)",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "var(--brand-gray)",
                }}
              >
                After submitting, our team will review your request and confirm
                the appointment within 24 hours.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ justifyContent: "center" }}
              >
                {saving ? (
                  "Submitting..."
                ) : (
                  <>
                    <Calendar size={16} /> Submit Booking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserBookings() {
  const { action } = useParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    userApi
      .get("/bookings/my")
      .then((response) => setBookings(response.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (action === "new") return <NewBookingForm />;

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await userApi.put(`/bookings/${id}/cancel`);
      const refreshed = await userApi.get("/bookings/my");
      setBookings(refreshed.data.data || []);
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div>
      <div className="user-page-header">
        <div>
          <h2 className="user-page-title">My Bookings</h2>
          <p className="user-page-subtitle">
            Track every request, meeting, and project update.
          </p>
        </div>
        <Link to="/dashboard/bookings/new" className="btn btn-primary btn-sm">
          <Plus size={24} /> New Booking
        </Link>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="user-empty">
          <Calendar size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
          <h3>No bookings yet</h3>
          <p style={{ marginBottom: "20px" }}>
            Book a service and we&apos;ll get started on your project.
          </p>
          <Link to="/dashboard/bookings/new" className="btn btn-primary">
            Book Your First Service
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="user-card"
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--brand-dark)",
                    }}
                  >
                    {booking.serviceName}
                  </h4>
                  <StatusBadge status={booking.status} />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    color: "var(--brand-gray)",
                    fontSize: "0.82rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Calendar size={12} />{" "}
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={12} /> {booking.time}
                  </span>
                </div>
                {booking.message && (
                  <p
                    style={{
                      color: "var(--brand-gray)",
                      fontSize: "0.83rem",
                      marginTop: "8px",
                      lineHeight: 1.5,
                    }}
                  >
                    {booking.message}
                  </p>
                )}
                {booking.adminNote && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 14px",
                      background: "rgba(37,99,235,0.08)",
                      border: "1px solid rgba(37,99,235,0.2)",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      color: "#2563eb",
                    }}
                  >
                    <strong>Admin Note:</strong> {booking.adminNote}
                  </div>
                )}
                {booking.invoice?.amount && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 14px",
                      background: booking.invoice.isPaid
                        ? "rgba(22,163,74,0.08)"
                        : "rgba(220,38,38,0.08)",
                      border: `1px solid ${booking.invoice.isPaid ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      color: booking.invoice.isPaid ? "#16a34a" : "#dc2626",
                    }}
                  >
                    Invoice #{booking.invoice.invoiceNo || "N/A"} -{" "}
                    {formatCurrency(booking.invoice.amount)}{" "}
                    {booking.invoice.isPaid ? "Paid" : "Unpaid"}
                  </div>
                )}
              </div>
              {!["completed", "cancelled"].includes(booking.status) && (
                <button
                  className="btn btn-sm"
                  onClick={() => handleCancel(booking._id)}
                  disabled={cancelling === booking._id}
                  style={{
                    background: "rgba(220,38,38,0.1)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    color: "#dc2626",
                    flexShrink: 0,
                  }}
                >
                  <X size={13} />{" "}
                  {cancelling === booking._id ? "..." : "Cancel"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
