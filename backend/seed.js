require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const { Service, Portfolio, Team, Testimonial, Blog, Pricing, Settings } = require('./models');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([
    Service.deleteMany(), Portfolio.deleteMany(), Team.deleteMany(),
    Testimonial.deleteMany(), Blog.deleteMany(), Pricing.deleteMany(), Settings.deleteMany()
  ]);
  console.log('Cleared existing data');

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminExists = await Admin.findOne({ email: 'admin@brandlift.com' });
  if (!adminExists) {
    await Admin.create({ name: 'BrandLift Admin', email: 'admin@brandlift.com', password: 'Admin@1234' });
    console.log('Admin created: admin@brandlift.com / Admin@1234');
  }

  // ── Services ───────────────────────────────────────────────────────────────
  await Service.insertMany([
    { title: 'SEO Optimization', category: 'Digital Marketing', description: 'Rank higher on Google with proven SEO strategies that drive organic traffic and boost your online visibility.', icon: '🔍', features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Technical SEO'], order: 1 },
    { title: 'Graphics Design', category: 'Digital Marketing', description: 'Eye-catching visual content that communicates your brand message with clarity and creativity.', icon: '🎨', features: ['Logo Design', 'Social Media Graphics', 'Banner Design', 'Brand Identity'], order: 2 },
    { title: 'Social Media Management', category: 'Digital Marketing', description: 'Full-cycle social media management to grow your audience and keep them engaged consistently.', icon: '📱', features: ['Content Calendar', 'Post Scheduling', 'Community Management', 'Analytics Reports'], order: 3 },
    { title: 'Lead Generation', category: 'Digital Marketing', description: 'Data-driven lead generation campaigns that convert strangers into paying customers.', icon: '🎯', features: ['Facebook Ads', 'Google Ads', 'Landing Pages', 'Email Marketing'], order: 4 },
    { title: 'Cinematography', category: 'Visual & Communication', description: 'Cinematic video production that tells your brand story with emotion and impact.', icon: '🎬', features: ['Brand Films', 'Product Videos', 'Corporate Videos', 'Color Grading'], order: 5 },
    { title: 'Documentary & OVC', category: 'Visual & Communication', description: 'Professional documentary, OVC, and TVC production for television and digital platforms.', icon: '📺', features: ['Script Writing', 'Filming', 'Post Production', 'Sound Design'], order: 6 },
    { title: 'Event Photography', category: 'Visual & Communication', description: 'Capturing the essence of your events with professional photography and videography.', icon: '📸', features: ['Corporate Events', 'Product Launch', 'Conferences', 'Editing & Delivery'], order: 7 },
    { title: 'Web Design & Development', category: 'Tech Solution', description: 'Modern, fast, and conversion-optimized websites built with the latest technologies.', icon: '💻', features: ['Custom Design', 'Responsive Layout', 'CMS Integration', 'Performance Optimization'], order: 8 },
    { title: 'Android App Development', category: 'Tech Solution', description: 'Native and cross-platform Android apps that deliver smooth and intuitive user experiences.', icon: '📲', features: ['UI/UX Design', 'API Integration', 'Play Store Publishing', 'Maintenance'], order: 9 },
    { title: 'ERP & Inventory Software', category: 'Tech Solution', description: 'Custom ERP and inventory management solutions tailored to your business operations.', icon: '⚙️', features: ['Inventory Tracking', 'HR Module', 'Finance Module', 'Reporting Dashboard'], order: 10 },
    { title: 'CCTV Set-up', category: 'Tech Solution', description: 'Professional CCTV installation and monitoring solutions for businesses of all sizes.', icon: '📹', features: ['IP Cameras', 'NVR Setup', 'Remote Access', '24/7 Monitoring'], order: 11 },
    { title: 'Domain & Hosting', category: 'Tech Solution', description: 'Reliable domain registration and hosting services with 99.9% uptime guarantee.', icon: '🌐', features: ['Domain Registration', 'cPanel Hosting', 'SSL Certificate', 'Email Hosting'], order: 12 },
  ]);

  // ── Portfolio ──────────────────────────────────────────────────────────────
  await Portfolio.insertMany([
    { title: 'E-Commerce Platform for Dhaka Fashion', category: 'Web Development', description: 'A full-featured e-commerce website with payment gateway integration for a Dhaka-based fashion brand.', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', clientName: 'Dhaka Fashion House', tags: ['React', 'Node.js', 'MongoDB'], isFeatured: true },
    { title: 'Social Media Campaign – 500% ROI', category: 'Digital Marketing', description: 'A targeted Facebook and Instagram campaign that delivered a 500% return on ad spend for a local restaurant.', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', clientName: 'Spice Garden Restaurant', tags: ['Facebook Ads', 'Instagram', 'Lead Gen'], isFeatured: true },
    { title: 'Corporate Documentary Film', category: 'Cinematography', description: '10-minute corporate documentary showcasing the journey and impact of a Chittagong-based NGO.', imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800', clientName: 'Chittagong Relief Foundation', tags: ['Documentary', 'Editing', 'Color Grading'], isFeatured: true },
    { title: 'Hospital Management ERP', category: 'Tech Solution', description: 'Custom ERP software for a private hospital managing patients, inventory, billing, and HR.', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', clientName: 'City Medical Center', tags: ['ERP', 'Node.js', 'Dashboard'], isFeatured: false },
    { title: 'Brand Identity for Startup', category: 'Graphics Design', description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines.', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', clientName: 'TechStart BD', tags: ['Logo', 'Brand Identity', 'Typography'], isFeatured: false },
    { title: 'Android Food Delivery App', category: 'App Development', description: 'A native Android app for a local food delivery startup with real-time tracking and payment.', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', clientName: 'QuickBite BD', tags: ['Android', 'Firebase', 'Maps API'], isFeatured: false },
  ]);

  // ── Team ───────────────────────────────────────────────────────────────────
  await Team.insertMany([
    { name: 'Md. Rafiul Islam', role: 'CEO & Founder', bio: 'Digital marketing strategist with 8+ years of experience helping brands grow online.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', linkedin: '#', order: 1 },
    { name: 'Fatema Akter', role: 'Creative Director', bio: 'Award-winning designer passionate about creating visual stories that resonate.', imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', linkedin: '#', order: 2 },
    { name: 'Tanvir Hossain', role: 'Lead Developer', bio: 'Full-stack developer specializing in scalable web and mobile applications.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', linkedin: '#', order: 3 },
    { name: 'Nadia Rahman', role: 'SEO Specialist', bio: 'Data-driven SEO expert who has helped 50+ businesses rank on page 1 of Google.', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', linkedin: '#', order: 4 },
  ]);

  // ── Testimonials ───────────────────────────────────────────────────────────
  await Testimonial.insertMany([
    { clientName: 'Karim Chowdhury', clientRole: 'CEO', clientCompany: 'Dhaka Traders Ltd', message: 'BrandLift transformed our online presence completely. Our website traffic increased by 300% within 3 months and leads are flowing in every day. Best investment we made!', rating: 5, isFeatured: true },
    { clientName: 'Sadia Islam', clientRole: 'Marketing Manager', clientCompany: 'Green Leaf Organics', message: 'The social media management team is exceptional. They understand our brand voice and consistently create content that our audience loves. Highly recommended!', rating: 5, isFeatured: true },
    { clientName: 'Rahim Uddin', clientRole: 'Owner', clientCompany: 'Rahim Electronics', message: 'Their ERP solution saved us countless hours every week. The inventory tracking is flawless and the support team is always responsive. 10/10!', rating: 5, isFeatured: true },
    { clientName: 'Nasrin Begum', clientRole: 'Director', clientCompany: 'Style Hub BD', message: 'The brand identity they created for us is stunning. We get compliments on our logo every single day. The team is creative, professional and delivered on time.', rating: 4, isFeatured: false },
  ]);

  // ── Blog Posts ─────────────────────────────────────────────────────────────
  await Blog.insertMany([
    { title: '10 SEO Strategies That Actually Work in 2024', slug: '10-seo-strategies-2024', excerpt: 'Discover the proven SEO techniques that are driving real results for businesses in Bangladesh and beyond.', content: '<p>SEO in 2024 is about quality, relevance, and user experience. Here are the top 10 strategies...</p><h2>1. Focus on Search Intent</h2><p>Understanding what users actually want when they search is the foundation of modern SEO...</p>', coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800', author: 'Nadia Rahman', tags: ['SEO', 'Digital Marketing', 'Google'], category: 'SEO', isPublished: true, publishedAt: new Date('2024-01-15'), views: 342 },
    { title: 'Why Your Business Needs Social Media Marketing Now', slug: 'why-social-media-marketing-now', excerpt: 'Social media is no longer optional for businesses. Learn why and how to get started the right way.', content: '<p>With over 45 million social media users in Bangladesh, the opportunity is massive...</p>', coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800', author: 'Fatema Akter', tags: ['Social Media', 'Marketing', 'Business'], category: 'Social Media', isPublished: true, publishedAt: new Date('2024-02-01'), views: 218 },
    { title: 'The Complete Guide to Building a Brand Identity', slug: 'complete-guide-brand-identity', excerpt: 'From logo to color palette — everything you need to know about building a memorable brand identity.', content: '<p>A strong brand identity is the foundation of all your marketing efforts...</p>', coverImage: 'https://images.unsplash.com/photo-1553835973-dec43bfddbeb?w=800', author: 'Fatema Akter', tags: ['Branding', 'Design', 'Business'], category: 'Branding', isPublished: true, publishedAt: new Date('2024-02-20'), views: 189 },
  ]);

  // ── Pricing ────────────────────────────────────────────────────────────────
  await Pricing.insertMany([
    { name: 'Starter', price: 5000, currency: 'BDT', period: 'month', category: 'Digital Marketing', description: 'Perfect for small businesses getting started', features: ['Social Media Management (2 platforms)', '8 posts per month', 'Basic SEO', 'Monthly Report', 'Email Support'], isPopular: false, order: 1 },
    { name: 'Growth', price: 12000, currency: 'BDT', period: 'month', category: 'Digital Marketing', description: 'For growing businesses ready to scale', features: ['Social Media Management (4 platforms)', '20 posts per month', 'Advanced SEO', 'Facebook & Google Ads', 'Weekly Reports', 'Priority Support', 'Graphic Design (10 creatives)'], isPopular: true, order: 2 },
    { name: 'Enterprise', price: 25000, currency: 'BDT', period: 'month', category: 'Digital Marketing', description: 'Full-service digital marketing solution', features: ['All platforms managed', 'Unlimited posts', 'Full SEO Suite', 'All Ad Platforms', 'Daily Reports', 'Dedicated Account Manager', 'Video Content (2/month)', 'Content Strategy'], isPopular: false, order: 3 },
  ]);

  // ── Settings ───────────────────────────────────────────────────────────────
  await Settings.insertMany([
    { key: 'site_name', value: 'BrandLift', group: 'general' },
    { key: 'site_tagline', value: 'Promote Your Brand', group: 'general' },
    { key: 'phone', value: '01876385596', group: 'contact' },
    { key: 'email', value: 'brandliftbd@gmail.com', group: 'contact' },
    { key: 'address', value: 'Boropol, Halishahar, Chittagong', group: 'contact' },
    { key: 'facebook', value: 'https://facebook.com/brandliftbd', group: 'social' },
    { key: 'instagram', value: 'https://instagram.com/brandliftbd', group: 'social' },
    { key: 'linkedin', value: 'https://linkedin.com/company/brandliftbd', group: 'social' },
    { key: 'hero_title', value: 'We Grow Brands in the Digital World', group: 'hero' },
    { key: 'hero_subtitle', value: 'Full-service digital marketing agency specializing in SEO, social media, video production, and tech solutions.', group: 'hero' },
    { key: 'about_text', value: 'BrandLift is a Chittagong-based digital marketing agency helping businesses shine online since 2018. We craft innovative advertising and marketing strategies that help brands reach their full potential in the digital world.', group: 'about' },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📧 Admin Login:');
  console.log('   Email:    admin@brandlift.com');
  console.log('   Password: Admin@1234');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
