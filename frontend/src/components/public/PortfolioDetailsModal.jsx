import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import "./PortfolioDetailsModal.css";

export default function PortfolioDetailsModal({ open, item, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div
      className="portfolio-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="portfolio-modal" role="dialog" aria-modal="true">
        <div className="portfolio-modal__media">
          <img src={item.imageUrl} alt={item.title} />

          {item.isFeatured && (
            <span className="badge portfolio-modal__featured">
              Featured
            </span>
          )}

          <button
            type="button"
            className="portfolio-modal__close"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="portfolio-modal__content">
          <div className="portfolio-modal__head">
            <div style={{ minWidth: 0 }}>
              <span className="badge badge-blue">{item.category}</span>
              <h3 className="portfolio-modal__title">{item.title}</h3>
            </div>

            {item.projectUrl && (
              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ whiteSpace: "nowrap" }}
              >
                Visit <ExternalLink size={14} />
              </a>
            )}
          </div>

          <p className="portfolio-modal__desc">{item.description}</p>

          {(item.clientName || item.completedAt) && (
            <div className="portfolio-modal__meta">
              {item.clientName && (
                <div>
                  <span className="portfolio-modal__meta-label">Client</span>
                  <span className="portfolio-modal__meta-value">
                    {item.clientName}
                  </span>
                </div>
              )}
              {item.completedAt && (
                <div>
                  <span className="portfolio-modal__meta-label">Completed</span>
                  <span className="portfolio-modal__meta-value">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {item.tags?.length > 0 && (
            <div className="portfolio-modal__tags">
              {item.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="portfolio-modal__footer">
          <Link to="/contact" className="btn btn-primary" onClick={onClose}>
           Get Quote
          </Link>
          <Link to="/portfolio" className="btn btn-outline" onClick={onClose}>
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

