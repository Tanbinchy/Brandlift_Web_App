import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Star,
  Users,
  Award,
  TrendingUp,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import HeroCanvas from "../../components/public/HeroCanvas";
import api, { userApi } from "../../utils/api";
import { useUserAuth } from "../../context/UserAuthContext";
import ServiceDetailsModal from "../../components/public/ServiceDetailsModal";
import "./HomePage.css";

const StatCard = ({ number, label }) => (
  <div className="stat-card">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [team, setTeam] = useState([]);
  const [toggling, setToggling] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useUserAuth();

  useEffect(() => {
    api.get("/services?limit=6").then((r) => setServices(r.data.data));
    api.get("/testimonials?limit=4").then((r) => setTestimonials(r.data.data));
    api.get("/settings").then((r) => setSettings(r.data));
    api.get("/team?limit=4").then((r) => setTeam(r.data.data));
  }, []);

  const favourites = user?.favourites || [];
  const isFavourite = (serviceId) =>
    favourites.some((f) => (typeof f === "string" ? f : f?._id) === serviceId);

  const toggleFavourite = async (serviceId) => {
    if (!isAuthenticated) {
      toast.error("Please login to save services");
      navigate("/login");
      return;
    }
    setToggling(serviceId);
    try {
      await userApi.post(`/users/favourites/${serviceId}`);
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update favourites");
    } finally {
      setToggling(null);
    }
  };

  const categoryColors = {
    "Digital Marketing": "#f5a623",
    "Visual & Communication": "#7eb3ff",
    "Tech Solution": "#68d391",
  };

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="hero" style={{ position: "relative" }}>
        <div className="hero__bg" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}>
          <HeroCanvas />
        </div>
        <div className="container hero__content" style={{ position: "relative", zIndex: 1 }}>
          <div className="badge badge-gold fade-up">
            🚀 Chittagong's #1 Digital Agency
          </div>
          <h1 className="hero__title fade-up fade-up-delay-1">
            {settings.hero_title || "We Grow Brands in the"} <br />
            <span className="hero__title-accent">Digital World</span>
          </h1>
          <p className="hero__sub fade-up fade-up-delay-2">
            {settings.hero_subtitle ||
              "Full-service digital marketing agency specializing in SEO, social media, video production, and tech solutions."}
          </p>
          <div className="hero__cta fade-up fade-up-delay-3">
            <Link to="/contact" className="btn btn-primary">
              Get Free Consultation <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="btn btn-outline">
              View Our Work
            </Link>
          </div>
          <div className="hero__stats fade-up fade-up-delay-3">
            <StatCard number="200+" label="Projects Done" />
            <StatCard number="150+" label="Happy Clients" />
            <StatCard number="6+" label="Years Experience" />
            <StatCard number="12+" label="Services" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-gold" style={{ marginBottom: "12px" }}>
              What We Do
            </div>
            <h2>
              Our <span className="accent">Services</span>
            </h2>
            <p>
              From digital marketing to full tech solutions — we have everything
              your brand needs to grow.
            </p>
          </div>
          <div className="grid-3">
            {services.map((s, i) => (
              <div
                key={s._id}
                className="card service-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(s)}
                onKeyDown={(event) => event.key === "Enter" && setSelected(s)}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavourite(s._id);
                  }}
                  disabled={toggling === s._id}
                  className="service-card__fav-btn"
                  aria-label={
                    isFavourite(s._id)
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                  title={
                    isFavourite(s._id)
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                >
                  <Heart
                    size={16}
                    color={
                      isFavourite(s._id) ? "var(--brand-gold)" : "var(--brand-gray)"
                    }
                    fill={
                      isFavourite(s._id) ? "var(--brand-gold)" : "transparent"
                    }
                  />
                </button>
                <div
                  className="service-card__icon"
                  style={{
                    color: categoryColors[s.category] || "var(--brand-gold)",
                  }}
                >
                  {s.icon}
                </div>
                <span
                  className="badge"
                  style={{
                    background: "rgba(0,0,0,0.05)",
                    color: categoryColors[s.category] || "var(--brand-gray)",
                    border: `1px solid ${categoryColors[s.category] || "rgba(0,0,0,0.1)"}20`,
                    marginBottom: "10px",
                  }}
                >
                  {s.category}
                </span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                {s.features?.length > 0 && (
                  <ul className="service-card__features">
                    {s.features.slice(0, 3).map((f) => (
                      <li key={f}>
                        <CheckCircle size={13} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/services" className="btn btn-outline">
              See All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────────────── */}
      <section className="section whyus-section">
        <div className="container">
          <div className="whyus__inner">
            <div className="whyus__text">
              <div
                className="badge badge-gold"
                style={{ marginBottom: "12px" }}
              >
                Why BrandLift
              </div>
              <h2>
                We Don't Just Market —{" "}
                <span style={{ color: "var(--brand-gold)" }}>
                  We Deliver Results
                </span>
              </h2>
              <p style={{ color: "var(--brand-gray)", marginBottom: "28px" }}>
                {settings.about_text ||
                  "BrandLift is a Chittagong-based digital marketing agency helping businesses shine online."}
              </p>
              {[
                [
                  "Result-Oriented Approach",
                  "Every strategy is built around measurable outcomes and ROI.",
                ],
                [
                  "Experienced Creative Team",
                  "Our team brings diverse expertise across all digital channels.",
                ],
                [
                  "Transparent Reporting",
                  "You always know exactly what we're doing and what results we're getting.",
                ],
              ].map(([t, d]) => (
                <div key={t} className="whyus__point">
                  <div className="whyus__point-icon">
                    <Zap size={16} />
                  </div>
                  <div>
                    <strong>{t}</strong>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
              <Link
                to="/contact"
                className="btn btn-primary"
                style={{ marginTop: "24px" }}
              >
                Work With Us <ArrowRight size={16} />
              </Link>
            </div>
            <div className="whyus__visual">
              <div className="whyus__card-grid">
                {[
                  {
                    icon: <TrendingUp size={28} />,
                    val: "300%",
                    label: "Avg Traffic Growth",
                  },
                  {
                    icon: <Users size={28} />,
                    val: "150+",
                    label: "Active Clients",
                  },
                  {
                    icon: <Award size={28} />,
                    val: "12+",
                    label: "Industry Awards",
                  },
                  {
                    icon: <Star size={28} />,
                    val: "4.9★",
                    label: "Client Rating",
                  },
                ].map((item) => (
                  <div key={item.label} className="whyus__metric">
                    <div className="whyus__metric-icon">{item.icon}</div>
                    <span className="whyus__metric-val">{item.val}</span>
                    <span className="whyus__metric-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-gold" style={{ marginBottom: "12px" }}>
              Client Love
            </div>
            <h2>
              What Our <span className="accent">Clients Say</span>
            </h2>
          </div>
          <div className="grid-2">
            {testimonials.map((t) => (
              <div key={t._id} className="card testimonial-card">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < t.rating ? "" : "empty"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="testimonial-card__msg">"{t.message}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.clientImage ? (
                      <img src={t.clientImage} alt={t.clientName} />
                    ) : (
                      <span>{t.clientName[0]}</span>
                    )}
                  </div>
                  <div>
                    <strong>{t.clientName}</strong>
                    <span>
                      {t.clientRole}
                      {t.clientCompany && `, ${t.clientCompany}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────── */}
      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div
                className="badge badge-gold"
                style={{ marginBottom: "12px" }}
              >
                The Team
              </div>
              <h2>
                Meet the <span className="accent">Experts</span>
              </h2>
            </div>
            <div className="grid-4">
              {team.map((m) => (
                <div key={m._id} className="card team-card">
                  <div className="team-card__img">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} />
                    ) : (
                      <div className="team-card__placeholder">{m.name[0]}</div>
                    )}
                  </div>
                  <div className="team-card__info">
                    <h4>{m.name}</h4>
                    <span>{m.role}</span>
                    {m.bio && <p>{m.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <div>
              <h2>Ready to Grow Your Brand?</h2>
              <p>
                Get a free consultation with our digital marketing experts
                today.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/contact" className="btn btn-primary">
                Get Free Quote <ArrowRight size={16} />
              </Link>
              <a href="tel:+8801876385596" className="btn btn-outline">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ServiceDetailsModal
        open={!!selected}
        service={selected}
        onClose={() => setSelected(null)}
        onToggleFavourite={toggleFavourite}
        isFavourite={selected ? isFavourite(selected._id) : false}
        toggling={selected ? toggling === selected._id : false}
      />
    </div>
  );
}
