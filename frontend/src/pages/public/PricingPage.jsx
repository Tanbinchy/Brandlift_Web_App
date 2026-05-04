import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';

export default function PricingPage() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pricing').then(r => { setPlans(r.data.data); setLoading(false); });
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-header">
            <div className="badge badge-gold" style={{marginBottom:'12px'}}>Transparent Pricing</div>
            <h2>Simple, Honest <span className="accent">Pricing</span></h2>
            <p>No hidden fees. Pick the plan that fits your business needs.</p>
          </div>

          {loading
            ? <div className="loading-center"><div className="spinner"/></div>
            : (
              <div className="pricing-plans">
                {plans.map(plan => (
                  <div key={plan._id} className={`pricing-plan-card${plan.isPopular ? ' pricing-plan-card--popular' : ''}`} style={{
                    background: plan.isPopular ? 'linear-gradient(135deg, rgba(230,0,0,0.05), rgba(0,0,0,0.02))' : '#ffffff',
                    border: `1px solid ${plan.isPopular ? 'rgba(230,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '36px 28px',
                    transform: plan.isPopular ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: plan.isPopular ? '0 0 40px rgba(230,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.03)',
                  }}>
                    {plan.isPopular && (
                      <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)' }}>
                        <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={12} fill="currentColor"/> Most Popular
                        </span>
                      </div>
                    )}
                    <div>
                      {plan.category && <span className="badge badge-blue" style={{marginBottom:'8px'}}>{plan.category}</span>}
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--brand-dark)' }}>{plan.name}</h3>
                      {plan.description && <p style={{ color: 'var(--brand-gray)', fontSize: '0.87rem', marginTop: '6px' }}>{plan.description}</p>}
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: plan.isPopular ? 'var(--brand-gold)' : 'var(--brand-dark)' }}>
                        ৳{plan.price.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--brand-gray)', fontSize: '0.88rem' }}>/{plan.period}</span>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      {plan.features?.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--brand-dark)' }}>
                          <CheckCircle size={15} color="var(--brand-gold)" style={{flexShrink:0, marginTop:'2px'}}/> {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`} style={{textAlign:'center',justifyContent:'center'}}>
                      Get Started
                    </Link>
                  </div>
                ))}
              </div>
            )
          }

          <p style={{ textAlign: 'center', color: 'var(--brand-gray)', marginTop: '40px', fontSize: '0.9rem' }}>
            Need a custom plan? <Link to="/contact" style={{color:'var(--brand-gold)'}}>Contact us</Link> for a tailored quote.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
