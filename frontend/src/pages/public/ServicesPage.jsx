import { useEffect, useState } from 'react';
import { CheckCircle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api, { userApi } from '../../utils/api';
import { useUserAuth } from '../../context/UserAuthContext';
import ServiceDetailsModal from '../../components/public/ServiceDetailsModal';

const CATEGORIES = ['All', 'Digital Marketing', 'Visual & Communication', 'Tech Solution'];

export default function ServicesPage() {
  const [services,  setServices]  = useState([]);
  const [active,    setActive]    = useState('All');
  const [loading,   setLoading]   = useState(true);
  const [toggling, setToggling] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useUserAuth();

  useEffect(() => {
    api.get('/services').then(r => { setServices(r.data.data); setLoading(false); });
  }, []);

  const favourites = user?.favourites || [];
  const isFavourite = (serviceId) =>
    favourites.some((f) => (typeof f === 'string' ? f : f?._id) === serviceId);

  const toggleFavourite = async (serviceId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save services');
      navigate('/login');
      return;
    }
    setToggling(serviceId);
    try {
      await userApi.post(`/users/favourites/${serviceId}`);
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update favourites');
    } finally {
      setToggling(null);
    }
  };

  const filtered = active === 'All' ? services : services.filter(s => s.category === active);

  const catColor = { 'Digital Marketing': '#f5a623', 'Visual & Communication': '#7eb3ff', 'Tech Solution': '#68d391' };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-header">
            <div className="badge badge-gold" style={{marginBottom:'12px'}}>What We Offer</div>
            <h2>Our <span className="accent">Services</span></h2>
            <p>Comprehensive digital solutions designed to grow your business online.</p>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActive(c)} className={`btn btn-sm ${active === c ? 'btn-primary' : 'btn-outline'}`}>
                {c}
              </button>
            ))}
          </div>

          {loading
            ? <div className="loading-center"><div className="spinner"/></div>
            : (
              <div className="grid-3">
                {filtered.map(s => (
                  <div
                    key={s._id}
                    className="card"
                    style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(s)}
                    onKeyDown={(event) => event.key === 'Enter' && setSelected(s)}
                  >
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); toggleFavourite(s._id); }}
                      disabled={toggling === s._id}
                      className="btn btn-sm btn-outline"
                      aria-label={isFavourite(s._id) ? 'Remove from favourites' : 'Add to favourites'}
                      title={isFavourite(s._id) ? 'Remove from favourites' : 'Add to favourites'}
                      style={{
                        position: 'absolute',
                        top: '18px',
                        right: '18px',
                        padding: '8px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        opacity: toggling === s._id ? 0.7 : 1,
                      }}
                    >
                      <Heart
                        size={16}
                        color={isFavourite(s._id) ? 'var(--brand-gold)' : 'var(--brand-gray)'}
                        fill={isFavourite(s._id) ? 'var(--brand-gold)' : 'transparent'}
                      />
                    </button>
                    <div style={{ fontSize: '2.5rem' }}>{s.icon}</div>
                    <span className="badge" style={{ color: catColor[s.category], border: `1px solid ${catColor[s.category]}30`, background: `${catColor[s.category]}10`, width: 'fit-content' }}>
                      {s.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-dark)', fontSize: '1.15rem' }}>{s.title}</h3>
                    <p style={{ color: 'var(--brand-gray)', fontSize: '0.9rem', lineHeight: '1.7', flex: 1 }}>{s.description}</p>
                    {s.features?.length > 0 && (
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        {s.features.map(f => (
                          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--brand-gray)' }}>
                            <CheckCircle size={13} color="var(--brand-gold)" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
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
