import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';
import PortfolioDetailsModal from '../../components/public/PortfolioDetailsModal';

export default function PortfolioPage() {
  const [items,   setItems]   = useState([]);
  const [cats,    setCats]    = useState(['All']);
  const [active,  setActive]  = useState('All');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/portfolio').then(r => {
      setItems(r.data.data);
      const unique = ['All', ...new Set(r.data.data.map(i => i.category))];
      setCats(unique);
      setLoading(false);
    });
  }, []);

  const filtered = active === 'All' ? items : items.filter(i => i.category === active);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-header">
            <div className="badge badge-gold" style={{marginBottom:'12px'}}>Our Work</div>
            <h2>Project <span className="accent">Portfolio</span></h2>
            <p>A showcase of projects we're proud of.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActive(c)} className={`btn btn-sm ${active === c ? 'btn-primary' : 'btn-outline'}`}>{c}</button>
            ))}
          </div>

          {loading
            ? <div className="loading-center"><div className="spinner"/></div>
            : (
              <div className="grid-3">
                {filtered.map(item => (
                  <div
                    key={item._id}
                    className="card"
                    style={{ overflow: 'hidden', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(item)}
                    onKeyDown={(event) => event.key === 'Enter' && setSelected(item)}
                  >
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform='scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform='scale(1)'} />
                      {item.isFeatured && (
                        <span
                          className="badge"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'rgba(255,255,255,0.92)',
                            color: 'var(--brand-dark)',
                            border: '1px solid rgba(0,0,0,0.14)',
                            boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                            backdropFilter: 'blur(6px)',
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <span className="badge badge-blue" style={{marginBottom:'8px'}}>{item.category}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '6px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--brand-gray)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '12px' }}>{item.description}</p>
                      {item.clientName && <p style={{ fontSize: '0.8rem', color: 'var(--brand-gold)' }}>Client: {item.clientName}</p>}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {item.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
      <Footer />

      <PortfolioDetailsModal open={!!selected} item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
