import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';

export default function ContactPage() {
  const [form,     setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', form);
      setSuccess(true);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-header">
            <div className="badge badge-gold" style={{marginBottom:'12px'}}>Get In Touch</div>
            <h2>Let's <span className="accent">Talk</span></h2>
            <p>Ready to grow your brand? We'd love to hear from you.</p>
          </div>

          <div className="split-layout-alt">
            {/* INFO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: <Phone size={20}/>, label: 'Phone', value: '01876385596', href: 'tel:+8801876385596' },
                { icon: <Mail size={20}/>, label: 'Email', value: 'brandliftbd@gmail.com', href: 'mailto:brandliftbd@gmail.com' },
                { icon: <MapPin size={20}/>, label: 'Office', value: 'Boropol, Halishahar, Chittagong' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(230,0,0,0.1)', border: '1px solid rgba(230,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-gold)', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--brand-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
                    {item.href
                      ? <a href={item.href} style={{ color: 'var(--brand-dark)', fontWeight: 500, fontSize: '0.95rem' }}>{item.value}</a>
                      : <span style={{ color: 'var(--brand-dark)', fontWeight: 500, fontSize: '0.95rem' }}>{item.value}</span>}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '16px', padding: '20px', background: 'rgba(230,0,0,0.06)', border: '1px solid rgba(230,0,0,0.15)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '8px' }}>Business Hours</h4>
                <p style={{ color: 'var(--brand-gray)', fontSize: '0.88rem', lineHeight: '1.8' }}>
                  Saturday – Thursday: 9AM – 8PM<br/>
                  Friday: Closed<br/>
                  <strong style={{ color: 'var(--brand-dark)' }}>Emergency support available 24/7</strong>
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="card" style={{ padding: '36px' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--brand-gray)' }}>We'll get back to you within 24 hours.</p>
                  <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={() => setSuccess(false)}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
                    </div>
                    <div className="form-group">
                      <label>Subject *</label>
                      <select className="form-control" name="subject" value={form.subject} onChange={handleChange} required>
                        <option value="">Select subject</option>
                        <option>Digital Marketing</option>
                        <option>Web Development</option>
                        <option>App Development</option>
                        <option>Video Production</option>
                        <option>SEO Services</option>
                        <option>Pricing Inquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea className="form-control" name="message" value={form.message} onChange={handleChange} required placeholder="Tell us about your project..." rows={5} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                    {loading ? 'Sending...' : <><Send size={16}/> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
