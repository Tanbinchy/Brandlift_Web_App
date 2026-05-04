import { useState } from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--brand-light)',
        padding: 'clamp(16px, 4vw, 24px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(230,0,0,0.12), transparent 70%)',
          borderRadius: '50%',
          top: '-200px',
          right: '-200px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0,0,0,0.05), transparent 70%)',
          borderRadius: '50%',
          bottom: '-150px',
          left: '-150px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={24} color="var(--brand-gold)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>
              Brand<span style={{ color: 'var(--brand-gold)' }}>Lift</span>
            </span>
          </div>
          <p style={{ color: 'var(--brand-gray)', fontSize: '0.9rem' }}>Admin Dashboard</p>
        </div>

        <div className="card" style={{ padding: 'clamp(24px, 5vw, 36px)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
            Sign In
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-control"
                type="email"
                value={form.email}
                onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                required
                placeholder="admin@brandlift.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
                  required
                  placeholder="Enter your password"
                  style={{ paddingRight: '44px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((previous) => !previous)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    color: 'var(--brand-gray)',
                    padding: '4px',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '4px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
