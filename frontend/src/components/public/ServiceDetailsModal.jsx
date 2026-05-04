import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Heart, X } from "lucide-react";
import "./ServiceDetailsModal.css";

export default function ServiceDetailsModal({
  open,
  service,
  onClose,
  onToggleFavourite,
  isFavourite,
  toggling,
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !service) return null;

  return (
    <div
      className="service-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="service-modal" role="dialog" aria-modal="true">
        <div className="service-modal__header">
          <div className="service-modal__title">
            <div className="service-modal__icon" aria-hidden="true">
              {service.icon || "🛠️"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="service-modal__name">{service.title}</div>
              <div className="service-modal__meta">
                <span className="service-modal__category">{service.category}</span>
              </div>
            </div>
          </div>

          <div className="service-modal__actions">
            <button
              type="button"
              className="service-modal__iconbtn"
              onClick={() => onToggleFavourite?.(service._id)}
              disabled={toggling}
              aria-label={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
              title={isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart
                size={18}
                color={isFavourite ? "var(--brand-gold)" : "var(--brand-gray)"}
                fill={isFavourite ? "var(--brand-gold)" : "transparent"}
              />
            </button>

            <button
              type="button"
              className="service-modal__iconbtn"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="service-modal__body">
          <p className="service-modal__desc">{service.description}</p>

          {service.features?.length > 0 && (
            <div className="service-modal__section">
              <div className="service-modal__section-title">
                What’s included
              </div>
              <ul className="service-modal__features">
                {service.features.map((f) => (
                  <li key={f}>
                    <CheckCircle size={14} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="service-modal__footer">
          <Link to="/contact" className="btn btn-primary" onClick={onClose}>
            Get Quote
          </Link>
          <Link to="/services" className="btn btn-outline" onClick={onClose}>
            View all services
          </Link>
        </div>
      </div>
    </div>
  );
}

