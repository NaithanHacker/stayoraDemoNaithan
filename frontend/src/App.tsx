import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { Room } from './types';
import { api } from './services/api';

// Components
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BookingModal } from './components/common/BookingModal';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';

// Pages
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main App Layout Wrapper
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    api.getRooms().then(rooms => setAllRooms(rooms)).catch(() => {});
  }, []);

  const handleOpenBooking = (room?: Room) => {
    if (room) {
      setSelectedRoomForBooking(room);
    } else if (allRooms.length > 0) {
      setSelectedRoomForBooking(allRooms[0]);
    }
    setBookingModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      {/* Show Demo Banner on all pages */}
      <DemoBanner />

      {/* Guest Navigation (hidden on admin pages) */}
      {!isAdminRoute && <Navbar onOpenBooking={() => handleOpenBooking()} />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
          <Route path="/rooms" element={<RoomsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/rooms/:slug" element={<RoomDetailPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/experiences" element={<ExperiencesPage onOpenBooking={() => handleOpenBooking()} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />
        </Routes>
      </div>

      {/* Guest Footer & WhatsApp button (hidden on admin pages) */}
      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppFloatingButton />
        </>
      )}

      {/* Global Booking Inquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoom={selectedRoomForBooking}
        rooms={allRooms}
      />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <AppLayout />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}
