import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, TrendingUp } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <TrendingUp size={20} color="var(--brand-gold)" />
              <span>Brand<em>Lift</em></span>
            </div>
            <p>We specialize in crafting innovative advertising and marketing strategies that help brands shine in the digital world.</p>
            <div className="footer__social">
              <a href="https://facebook.com/brandliftbd" target="_blank" rel="noopener noreferrer"><Facebook size={18}/></a>
              <a href="https://instagram.com/brandliftbd" target="_blank" rel="noopener noreferrer"><Instagram size={18}/></a>
              <a href="https://linkedin.com/company/brandliftbd" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              {[['Home','/'],[' Services','/services'],['Portfolio','/portfolio'],['Blog','/blog'],['Pricing','/pricing'],['Contact','/contact']].map(([l,t])=>(
                <li key={t}><Link to={t}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              {['SEO Optimization','Social Media Marketing','Web Development','Android App','Cinematography','ERP Solutions'].map(s=>(
                <li key={s}><Link to="/services">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact Info</h4>
            <ul className="footer__contact">
              <li><Phone size={15}/><a href="tel:+8801876385596">01876385596</a></li>
              <li><Mail size={15}/><a href="mailto:brandliftbd@gmail.com">brandliftbd@gmail.com</a></li>
              <li><MapPin size={15}/><span>Boropol, Halishahar, Chittagong</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} BrandLift. All rights reserved.</p>
          <p>Built with ❤️ in Chittagong</p>
        </div>
      </div>
    </footer>
  );
}
