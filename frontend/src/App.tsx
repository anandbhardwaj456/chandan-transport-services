import { Route, Routes } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import RoutesPage from './pages/RoutesPage';
import BookingPage from './pages/BookingPage';
import BookingStatusPage from './pages/BookingStatusPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CorporatePage from './pages/CorporatePage';
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminCatalogPage from './pages/AdminCatalogPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/corporate" element={<CorporatePage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/book-taxi" element={<BookingPage />} />
          <Route path="/booking-status" element={<BookingStatusPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProtectedRoute roles={['customer', 'admin']}><AccountPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/admin/catalog" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminCatalogPage /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminInquiriesPage /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminServicesPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['admin', 'booking_manager']}><AdminSettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
