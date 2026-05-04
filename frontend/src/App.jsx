import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth }         from './context/AuthContext';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';

import ScrollToTop from './components/ScrollToTop';

// ── Public Pages ─────────────────────────────────────────────────────────────
import HomePage      from './pages/public/HomePage';
import ServicesPage  from './pages/public/ServicesPage';
import PortfolioPage from './pages/public/PortfolioPage';
import BlogPage      from './pages/public/BlogPage';
import BlogPostPage  from './pages/public/BlogPostPage';
import PricingPage   from './pages/public/PricingPage';
import ContactPage   from './pages/public/ContactPage';
import LoginPage     from './pages/public/LoginPage';
import RegisterPage  from './pages/public/RegisterPage';

// ── User Dashboard ────────────────────────────────────────────────────────────
import DashboardLayout   from './pages/user/DashboardLayout';
import DashboardOverview from './pages/user/DashboardOverview';
import UserBookings      from './pages/user/UserBookings';
import UserMessages      from './pages/user/UserMessages';
import UserInvoices      from './pages/user/UserInvoices';
import { UserFavourites, UserProfile } from './pages/user/UserProfileAndFavourites';

// ── Admin Pages ───────────────────────────────────────────────────────────────
import AdminLogin        from './pages/admin/AdminLogin';
import AdminLayout       from './pages/admin/AdminLayout';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminBookings     from './pages/admin/AdminBookings';
import AdminMessages     from './pages/admin/AdminMessages';
import AdminServices     from './pages/admin/AdminServices';
import AdminPortfolio    from './pages/admin/AdminPortfolio';
import AdminTeam         from './pages/admin/AdminTeam';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminBlog         from './pages/admin/AdminBlog';
import AdminPricing      from './pages/admin/AdminPricing';
import AdminContacts     from './pages/admin/AdminContacts';
import AdminSettings     from './pages/admin/AdminSettings';

// ── Route Guards ──────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const UserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1a3a6b', color: '#f8faff', border: '1px solid rgba(245,166,35,0.3)' }
          }} />
          <Routes>
            {/* ── Public ─────────────────────────────────────────────── */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/services"   element={<ServicesPage />} />
            <Route path="/portfolio"  element={<PortfolioPage />} />
            <Route path="/blog"       element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/pricing"    element={<PricingPage />} />
            <Route path="/contact"    element={<ContactPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />

            {/* ── User Dashboard ─────────────────────────────────────── */}
            <Route path="/dashboard" element={<UserRoute><DashboardLayout /></UserRoute>}>
              <Route index                   element={<DashboardOverview />} />
              <Route path="bookings"         element={<UserBookings />} />
              <Route path="bookings/:action" element={<UserBookings />} />
              <Route path="messages"         element={<UserMessages />} />
              <Route path="invoices"         element={<UserInvoices />} />
              <Route path="favourites"       element={<UserFavourites />} />
              <Route path="profile"          element={<UserProfile />} />
            </Route>

            {/* ── Admin (hidden from public nav) ─────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index                   element={<AdminDashboard />} />
              <Route path="users"            element={<AdminUsers />} />
              <Route path="bookings"         element={<AdminBookings />} />
              <Route path="messages"         element={<AdminMessages />} />
              <Route path="services"         element={<AdminServices />} />
              <Route path="portfolio"        element={<AdminPortfolio />} />
              <Route path="team"             element={<AdminTeam />} />
              <Route path="testimonials"     element={<AdminTestimonials />} />
              <Route path="blog"             element={<AdminBlog />} />
              <Route path="pricing"          element={<AdminPricing />} />
              <Route path="contacts"         element={<AdminContacts />} />
              <Route path="settings"         element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  );
}
