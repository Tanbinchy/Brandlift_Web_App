import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUserAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', background: 'var(--brand-light)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(230,0,0,0.12), transparent 70%)', borderRadius: '50%', top: '-100px', right: '-100px', pointerEvents: 'none' }} />
        <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp size={22} color="var(--brand-gold)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Brand<span style={{ color: 'var(--brand-gold)' }}>Lift</span></span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--brand-gray)', marginTop: '6px', fontSize: '0.9rem' }}>Sign in to your client portal</p>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-control" type={show ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="••••••••" style={{ width: '100%', paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShow(p => !p)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--brand-gray)', padding: '4px' }}>
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--brand-gray)', fontSize: '0.88rem' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>Create one free</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
