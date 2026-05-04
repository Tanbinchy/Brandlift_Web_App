import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(r => { setPosts(r.data.data); setLoading(false); });
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-header">
            <div className="badge badge-gold" style={{ marginBottom: '12px' }}>Insights</div>
            <h2>Our <span className="accent">Blog</span></h2>
            <p>Tips, strategies and insights from our digital marketing experts.</p>
          </div>

          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : (
              <div className="grid-3">
                {posts.map(post => (
                  <Link to={`/blog/${post.slug}`} key={post._id} className="card" style={{ textDecoration: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {post.coverImage && (
                      <div style={{ height: '190px', overflow: 'hidden' }}>
                        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      </div>
                    )}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {post.category && <span className="badge badge-gold">{post.category}</span>}
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-dark)', fontSize: '1.05rem', flex: 1 }}>{post.title}</h3>
                      <p style={{ color: 'var(--brand-gray)', fontSize: '0.87rem', lineHeight: '1.6' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <div style={{ display: 'flex', gap: '14px', color: 'var(--brand-gray)', fontSize: '0.78rem', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {post.views}</span>
                        </div>
                        <span style={{ color: 'var(--brand-gold)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Read <ArrowRight size={13} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}
