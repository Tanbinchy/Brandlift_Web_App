import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Plus, X, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "../../utils/api";

function ThreadView({ thread, onBack, onReply }) {
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
      const updated = await userApi.post(`/messages/${thread._id}/reply`, {
        text,
      });
      onReply(updated.data);
      setText("");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="user-card" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--brand-gray)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.88rem",
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--brand-dark)",
          }}
        >
          {thread.subject}
        </h3>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: 600,
            background:
              thread.status === "replied" ? "rgba(22,163,74,0.1)" : "#f4f4f5",
            color:
              thread.status === "replied" ? "#16a34a" : "var(--brand-gray)",
            border: `1px solid ${thread.status === "replied" ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.08)"}`,
            textTransform: "capitalize",
          }}
        >
          {thread.status}
        </span>
      </div>

      <div className="user-thread">
        <div className="user-thread__messages">
          {thread.thread?.map((message, index) => {
            const isUser = message.sender === "user";
            return (
              <div
                key={index}
                className={`user-message-row ${isUser ? "user-message-row--user" : "user-message-row--team"}`}
              >
                <div
                  className="user-message-bubble"
                  style={{
                    padding: "12px 16px",
                    borderRadius: isUser
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    background: isUser ? "rgba(245,166,35,0.12)" : "#f8fafc",
                    border: `1px solid ${isUser ? "rgba(245,166,35,0.25)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: isUser ? "var(--brand-gold)" : "#2563eb",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {isUser ? "You" : "BrandLift Team"}
                  </div>
                  <div
                    style={{
                      color: "var(--brand-dark)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--brand-gray)",
                      marginTop: "6px",
                      textAlign: isUser ? "right" : "left",
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
      </div>

      {thread.status !== "closed" ? (
        <form
          onSubmit={handleReply}
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <textarea
            className="form-control"
            rows={2}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your reply..."
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
            style={{ alignSelf: "flex-end", padding: "10px 16px" }}
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f8fafc",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "10px",
            textAlign: "center",
            color: "var(--brand-gray)",
            fontSize: "0.85rem",
          }}
        >
          This conversation is closed.
        </div>
      )}
    </div>
  );
}

export default function UserMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ subject: "", text: "" });
  const [newSending, setNewSending] = useState(false);

  const load = async () => {
    try {
      const response = await userApi.get("/messages/my");
      setMessages(response.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleNew = async (event) => {
    event.preventDefault();
    setNewSending(true);
    try {
      const response = await userApi.post("/messages", newForm);
      toast.success("Message sent!");
      setMessages((prev) => [response.data, ...prev]);
      setNewForm({ subject: "", text: "" });
      setShowNew(false);
      setSelected(response.data);
    } catch {
      toast.error("Failed to send");
    } finally {
      setNewSending(false);
    }
  };

  const handleReply = (updated) => {
    setSelected(updated);
    setMessages((prev) =>
      prev.map((message) => (message._id === updated._id ? updated : message)),
    );
  };

  if (selected) {
    return (
      <ThreadView
        thread={selected}
        onBack={() => {
          setSelected(null);
          load();
        }}
        onReply={handleReply}
      />
    );
  }

  return (
    <div>
      <div className="user-page-header">
        <div>
          <h2 className="user-page-title">Messages</h2>
          <p className="user-page-subtitle">
            Talk directly with the BrandLift team.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowNew((prev) => !prev)}
        >
          {showNew ? (
            <>
              <X size={15} /> Cancel
            </>
          ) : (
            <>
              <Plus size={24} /> New Message
            </>
          )}
        </button>
      </div>

      {showNew && (
        <div className="user-card" style={{ marginBottom: "24px" }}>
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--brand-dark)",
              }}
            >
              New Message to BrandLift Team
            </h3>
          </div>
          <form onSubmit={handleNew}>
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div className="form-group">
                <label>Subject *</label>
                <input
                  className="form-control"
                  value={newForm.subject}
                  onChange={(event) =>
                    setNewForm((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                  required
                  placeholder="What's this about?"
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={newForm.text}
                  onChange={(event) =>
                    setNewForm((prev) => ({
                      ...prev,
                      text: event.target.value,
                    }))
                  }
                  required
                  placeholder="Describe your question or request in detail..."
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={newSending}
                style={{ alignSelf: "flex-start" }}
              >
                {newSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={14} /> Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : messages.length === 0 ? (
        <div className="user-empty">
          <MessageSquare
            size={40}
            style={{ margin: "0 auto 16px", opacity: 0.3 }}
          />
          <h3>No messages yet</h3>
          <p style={{ marginBottom: "20px" }}>
            Have a question? Send us a message and we&apos;ll reply within 24
            hours.
          </p>
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            Send First Message
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.map((message) => {
            const hasUnread =
              !message.isReadByUser && message.status === "replied";
            return (
              <div
                key={message._id}
                className="user-card"
                onClick={() => setSelected(message)}
                style={{
                  border: `1px solid ${hasUnread ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.08)"}`,
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor =
                    "rgba(245,166,35,0.3)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = hasUnread
                    ? "rgba(22,163,74,0.3)"
                    : "rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: hasUnread ? "rgba(22,163,74,0.1)" : "#f4f4f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: hasUnread ? "#16a34a" : "var(--brand-gray)",
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={18} />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "3px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: hasUnread ? 700 : 500,
                        color: "var(--brand-dark)",
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {message.subject}
                    </span>
                    {hasUnread && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          background: "#16a34a",
                          color: "#ffffff",
                          padding: "1px 6px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        NEW REPLY
                      </span>
                    )}
                  </div>
                  <div
                    style={{ fontSize: "0.78rem", color: "var(--brand-gray)" }}
                  >
                    {message.thread?.length} message
                    {message.thread?.length !== 1 ? "s" : ""} -{" "}
                    {new Date(message.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    background:
                      message.status === "replied"
                        ? "rgba(22,163,74,0.1)"
                        : message.status === "closed"
                          ? "#f4f4f5"
                          : "rgba(245,166,35,0.1)",
                    color:
                      message.status === "replied"
                        ? "#16a34a"
                        : message.status === "closed"
                          ? "var(--brand-gray)"
                          : "var(--brand-gold)",
                    border: `1px solid ${message.status === "replied" ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.08)"}`,
                    flexShrink: 0,
                  }}
                >
                  {message.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
