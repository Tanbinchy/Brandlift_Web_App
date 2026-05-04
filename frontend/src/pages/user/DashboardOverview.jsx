import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  FileText,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { userApi } from "../../utils/api";

const STATUS_CONFIG = {
  none: {
    label: "No Active Project",
    color: "var(--brand-gray)",
    bg: "#f4f4f5",
  },
  pending: {
    label: "Pending Review",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.08)",
  },
  "in-progress": {
    label: "In Progress",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
  },
  review: {
    label: "Under Review",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
  },
  completed: {
    label: "Completed",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
  },
};

const QuickCard = ({ icon, label, value, to, color = "var(--brand-gold)" }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div
      className="user-card"
      style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "var(--transition)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "var(--brand-dark)",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--brand-gray)",
            marginTop: "3px",
          }}
        >
          {label}
        </div>
      </div>
      <ArrowRight
        size={16}
        style={{ marginLeft: "auto", color: "var(--brand-gray)" }}
      />
    </div>
  </Link>
);

export default function DashboardOverview() {
  const { user } = useUserAuth();
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userApi.get("/bookings/my"), userApi.get("/messages/my")])
      .then(([bookingsResponse, messagesResponse]) => {
        const bookingData = bookingsResponse.data.data || [];
        setBookings(bookingData);
        setMessages(messagesResponse.data.data || []);
        setInvoices(bookingData.filter((booking) => booking.invoice?.amount));
      })
      .finally(() => setLoading(false));
  }, []);

  const status = STATUS_CONFIG[user?.projectStatus || "none"];
  const unreadMessages = messages.filter(
    (message) => !message.isReadByUser && message.status === "replied",
  ).length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const unpaidInvoices = invoices.filter(
    (invoice) => !invoice.invoice?.isPaid,
  ).length;

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div className="user-page-header">
        <div>
          <h2
            className="user-page-title"
            style={{ fontSize: "1.5rem", marginBottom: "4px" }}
          >
            Hello, {user?.name?.split(" ")[0] || "Client"}
          </h2>
          <p className="user-page-subtitle">
            Here is a quick overview of your account.
          </p>
        </div>
        <Link to="/dashboard/bookings/new" className="btn btn-primary btn-sm">
          <Calendar size={24} /> Book a Service
        </Link>
      </div>

      <div
        className="user-card"
        style={{
          padding: "20px 24px",
          background: status.bg,
          border: `1px solid ${status.color}30`,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "#ffffff",
            border: `1px solid ${status.color}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: status.color,
          }}
        >
          <CheckCircle size={20} />
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--brand-gray)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "2px",
            }}
          >
            Your Project Status
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: status.color,
            }}
          >
            {status.label}
          </div>
        </div>
        {user?.projectStatus !== "none" && (
          <div style={{ marginLeft: "auto" }}>
            <Link
              to="/dashboard/bookings"
              style={{ fontSize: "0.82rem", color: status.color }}
            >
              View Details
            </Link>
          </div>
        )}
      </div>

      <div className="grid-4" style={{ gap: "16px" }}>
        <QuickCard
          icon={<Calendar size={20} />}
          label="Total Bookings"
          value={bookings.length}
          to="/dashboard/bookings"
          color="var(--brand-gold)"
        />
        <QuickCard
          icon={<MessageSquare size={20} />}
          label="Messages"
          value={messages.length}
          to="/dashboard/messages"
          color="#2563eb"
        />
        <QuickCard
          icon={<FileText size={20} />}
          label="Invoices"
          value={invoices.length}
          to="/dashboard/invoices"
          color="#7c3aed"
        />
        <QuickCard
          icon={<Heart size={20} />}
          label="Saved Services"
          value={user?.favourites?.length || 0}
          to="/dashboard/favourites"
          color="#dc2626"
        />
      </div>

      {(unreadMessages > 0 || pendingBookings > 0 || unpaidInvoices > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {unreadMessages > 0 && (
            <Link
              to="/dashboard/messages"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: "10px",
                color: "#2563eb",
                fontSize: "0.88rem",
              }}
            >
              <MessageSquare size={15} /> You have{" "}
              <strong>{unreadMessages} new reply</strong> from our team{" "}
              <ArrowRight size={13} style={{ marginLeft: "auto" }} />
            </Link>
          )}
          {pendingBookings > 0 && (
            <Link
              to="/dashboard/bookings"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.2)",
                borderRadius: "10px",
                color: "var(--brand-gold)",
                fontSize: "0.88rem",
              }}
            >
              <Clock size={15} />{" "}
              <strong>
                {pendingBookings} booking{pendingBookings > 1 ? "s" : ""}
              </strong>{" "}
              awaiting confirmation{" "}
              <ArrowRight size={13} style={{ marginLeft: "auto" }} />
            </Link>
          )}
          {unpaidInvoices > 0 && (
            <Link
              to="/dashboard/invoices"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: "10px",
                color: "#dc2626",
                fontSize: "0.88rem",
              }}
            >
              <AlertCircle size={15} />{" "}
              <strong>
                {unpaidInvoices} unpaid invoice{unpaidInvoices > 1 ? "s" : ""}
              </strong>{" "}
              pending payment{" "}
              <ArrowRight size={13} style={{ marginLeft: "auto" }} />
            </Link>
          )}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="user-card">
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--brand-dark)",
              }}
            >
              Recent Bookings
            </h3>
            <Link
              to="/dashboard/bookings"
              style={{ fontSize: "0.8rem", color: "var(--brand-gold)" }}
            >
              View All
            </Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {bookings.slice(0, 4).map((booking) => {
              const statusColors = {
                pending: "#f5a623",
                confirmed: "#2563eb",
                "in-progress": "#7c3aed",
                completed: "#16a34a",
                cancelled: "#dc2626",
              };
              return (
                <div
                  key={booking._id}
                  style={{
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: "var(--brand-dark)",
                      }}
                    >
                      {booking.serviceName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--brand-gray)",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(booking.date).toLocaleDateString()} at{" "}
                      {booking.time}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: `${statusColors[booking.status]}15`,
                      color: statusColors[booking.status],
                      border: `1px solid ${statusColors[booking.status]}30`,
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
