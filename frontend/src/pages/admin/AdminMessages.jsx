import { useEffect, useRef, useState } from "react";
import { CheckCircle, Send, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

function ThreadPanel({ thread, onClose, onUpdate }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleReply = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    try {
      const response = await api.post(`/messages/${thread._id}/admin-reply`, {
        text,
      });
      onUpdate(response.data);
      setText("");
      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    try {
      const response = await api.put(`/messages/${thread._id}/close`);
      onUpdate(response.data);
      toast.success("Thread closed");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="admin-card admin-side-panel admin-message-panel">
      <div className="admin-card-header" style={{ flexShrink: 0 }}>
        <div style={{ overflow: "hidden", minWidth: 0 }}>
          <h3
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {thread.subject}
          </h3>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--brand-gray)",
              marginTop: "2px",
            }}
          >
            From{" "}
            <strong style={{ color: "var(--brand-dark)" }}>
              {thread.user?.name}
            </strong>{" "}
            ({thread.user?.email})
          </div>
        </div>
        <div
          className="admin-card-header__actions"
          style={{ flexShrink: 0, justifyContent: "flex-end" }}
        >
          {thread.status !== "closed" && (
            <button
              className="btn btn-sm btn-outline"
              onClick={handleClose}
              style={{ fontSize: "0.78rem" }}
            >
              <CheckCircle size={13} /> Close
            </button>
          )}
          <button
            style={{
              background: "none",
              color: "var(--brand-gray)",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {thread.thread?.map((message, index) => {
          const isAdmin = message.sender === "admin";

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isAdmin ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: isAdmin
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                  background: isAdmin ? "rgba(245,166,35,0.12)" : "#f8fafc",
                  border: `1px solid ${isAdmin ? "rgba(245,166,35,0.25)" : "rgba(0,0,0,0.08)"}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    color: isAdmin ? "var(--brand-gold)" : "#2563eb",
                  }}
                >
                  {isAdmin ? "You (Admin)" : thread.user?.name || "Client"}
                </div>
                <div
                  style={{
                    color: "var(--brand-dark)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--brand-gray)",
                    marginTop: "5px",
                    textAlign: isAdmin ? "right" : "left",
                  }}
                >
                  {new Date(message.sentAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        {thread.status === "closed" ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--brand-gray)",
              fontSize: "0.85rem",
              padding: "8px",
            }}
          >
            Thread is closed
          </div>
        ) : (
          <form onSubmit={handleReply} className="admin-reply-form">
            <textarea
              className="form-control"
              rows={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your reply to the client..."
              style={{ flex: 1, resize: "none" }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleReply(event);
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !text.trim()}
              style={{ alignSelf: "flex-end", padding: "10px 14px" }}
            >
              <Send size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = () => {
    const url = filter === "all" ? "/messages" : `/messages?status=${filter}`;
    api.get(url).then((response) => {
      setMessages(response.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const openThread = async (message) => {
    const response = await api.get(`/messages/${message._id}`);
    setSelected(response.data);
    load();
  };

  const handleUpdate = (updated) => {
    setSelected(updated);
    setMessages((previous) =>
      previous.map((message) =>
        message._id === updated._id ? updated : message,
      ),
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message thread?")) return;

    try {
      await api.delete(`/messages/${id}`);
      toast.success("Deleted");
      if (selected?._id === id) setSelected(null);
      load();
    } catch {
      toast.error("Failed");
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.isReadByAdmin,
  ).length;
  const splitViewClassName = `admin-split-view${selected ? "" : " admin-split-view--single"}`;

  return (
    <div className={splitViewClassName}>
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-header__meta">
            <h3>User Messages ({messages.length})</h3>
            {unreadCount > 0 && (
              <span className="badge badge-gold">{unreadCount} unread</span>
            )}
          </div>
          <div className="admin-card-header__actions">
            {["all", "open", "replied", "closed"].map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-outline"}`}
                style={{
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Subject</th>
                  <th>Messages</th>
                  <th>Status</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => {
                  const unread = !message.isReadByAdmin;
                  const statusColor = {
                    open: "#f5a623",
                    replied: "#68d391",
                    closed: "var(--brand-gray)",
                  };

                  return (
                    <tr
                      key={message._id}
                      onClick={() => openThread(message)}
                      style={{
                        cursor: "pointer",
                        background:
                          selected?._id === message._id
                            ? "rgba(245,166,35,0.04)"
                            : "transparent",
                      }}
                    >
                      <td>
                        <div style={{ fontWeight: unread ? 700 : 500 }}>
                          {message.user?.name || "Unknown"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--brand-gray)",
                          }}
                        >
                          {message.user?.email}
                        </div>
                      </td>
                      <td style={{ fontWeight: unread ? 700 : 400 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          {unread && (
                            <span
                              style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#68d391",
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          {message.subject}
                        </div>
                      </td>
                      <td style={{ color: "var(--brand-gray)" }}>
                        {message.thread?.length || 0}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            textTransform: "capitalize",
                            background: `${statusColor[message.status]}15`,
                            color: statusColor[message.status],
                            border: `1px solid ${statusColor[message.status]}30`,
                          }}
                        >
                          {message.status}
                        </span>
                      </td>
                      <td
                        style={{
                          color: "var(--brand-gray)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {new Date(message.updatedAt).toLocaleDateString()}
                      </td>
                      <td onClick={(event) => event.stopPropagation()}>
                        <div className="admin-action-row">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(message._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {messages.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        color: "var(--brand-gray)",
                        padding: "40px",
                      }}
                    >
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ThreadPanel
          thread={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
