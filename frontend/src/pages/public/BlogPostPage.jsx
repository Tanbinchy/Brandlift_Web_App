import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../utils/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    api.get(`/blog/slug/${slug}`)
      .then(r => { setPost(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="loading-center" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (error || !post) return (
    <div style={{paddingTop:'100px', textAlign:'center', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px'}}>
      <h2>Post not found</h2>
      <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '780px', padding: '60px 24px' }}>
          <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-gray)', marginBottom: '32px', fontSize: '0.9rem' }}>
            <ArrowLeft size={16}/> Back to Blog
          </Link>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }} />
          )}

          {post.category && <span className="badge badge-gold" style={{marginBottom:'16px'}}>{post.category}</span>}
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '16px', lineHeight: '1.2' }}>{post.title}</h1>

          <div style={{ display: 'flex', gap: '20px', color: 'var(--brand-gray)', fontSize: '0.85rem', marginBottom: '32px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14}/> {new Date(post.publishedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Eye size={14}/> {post.views} views</span>
            <span>By {post.author}</span>
          </div>

          <div
            style={{ color: 'var(--brand-light)', lineHeight: '1.9', fontSize: '1rem' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag size={14} color="var(--brand-gray)" />
              {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
