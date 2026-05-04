import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useUserAuth();
  const navigate     = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to BrandLift.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const perks = ['Book services & appointments', 'Track your project status', 'Message our team directly', 'View invoices & payments'];

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', background: 'var(--brand-light)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(230,0,0,0.12), transparent 70%)', borderRadius: '50%', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,0,0,0.05), transparent 70%)', borderRadius: '50%', bottom: '-150px', right: '-150px', pointerEvents: 'none' }} />
        <div className="split-layout" style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>

          {/* LEFT — perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp size={22} color="var(--brand-gold)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>Brand<span style={{ color: 'var(--brand-gold)' }}>Lift</span></span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '12px' }}>
                Join Our <span style={{ color: 'var(--brand-gold)' }}>Client Portal</span>
              </h2>
              <p style={{ color: 'var(--brand-gray)', lineHeight: 1.7 }}>Create a free account and get full access to your client dashboard.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {perks.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--brand-gold)" />
                  <span style={{ color: 'var(--brand-dark)', fontSize: '0.95rem', fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="card" style={{ padding: '36px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Create Account</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="01XXXXXXXXX" />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-control" type={show ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min 6 characters" style={{ width: '100%', paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShow(p => !p)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--brand-gray)', padding: '4px' }}>
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input className="form-control" type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required placeholder="Repeat password" />
                {form.password && form.confirm && (
                  <span style={{ fontSize: '0.78rem', color: form.password === form.confirm ? '#38a169' : '#e53e3e', marginTop: '4px' }}>
                    {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--brand-gray)', fontSize: '0.88rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
