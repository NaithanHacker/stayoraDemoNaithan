import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stayora-navy/95 backdrop-blur-md py-3.5 shadow-luxury border-b border-stayora-gold/15'
          : 'bg-gradient-to-b from-stayora-navy/85 via-stayora-navy/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-stayora-gold/50 flex items-center justify-center bg-stayora-navy/60 group-hover:border-stayora-gold transition-colors duration-300">
              <span className="font-serif text-stayora-gold text-xl font-bold tracking-wider">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-stayora-sand-light uppercase group-hover:text-stayora-gold transition-colors">
                {settings.site_name}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-stayora-gold uppercase font-light">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-wider uppercase font-medium transition-all duration-200 py-1 border-b-2 ${
                  isActive(link.path)
                    ? 'text-stayora-gold border-stayora-gold'
                    : 'text-stayora-sand/90 border-transparent hover:text-stayora-gold hover:border-stayora-gold/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs text-stayora-gold hover:text-white px-3 py-1.5 rounded border border-stayora-gold/30 hover:border-stayora-gold transition-all"
                title="Staff Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff: {user.username}</span>
              </Link>
            ) : null}

            <a
              href={`tel:${settings.contact_phone}`}
              className="text-stayora-sand/80 hover:text-stayora-gold p-2 transition-colors"
              title="Call Concierge"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenBooking}
              className="btn-gold px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Stay</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="btn-gold px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stayora-sand hover:text-stayora-gold transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-stayora-navy/98 backdrop-blur-xl z-50 overflow-y-auto px-6 py-8 border-t border-stayora-gold/20 animate-fadeIn">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-lg tracking-widest uppercase font-serif py-2 border-b border-stayora-gold/10 transition-colors ${
                  isActive(link.path) ? 'text-stayora-gold font-bold' : 'text-stayora-sand hover:text-stayora-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-6 space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full btn-gold py-3 rounded-sm text-center font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Room or Suite</span>
              </button>

              <div className="p-4 rounded bg-stayora-navy-light/60 border border-stayora-gold/20 text-xs text-stayora-sand/80 space-y-2">
                <p className="flex items-center gap-2 text-stayora-gold font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> 24/7 Concierge Desk
                </p>
                <p>Phone: {settings.contact_phone}</p>
                <p>WhatsApp: {settings.whatsapp_number}</p>
                <p>Location: {settings.city}, {settings.state}, {settings.country}</p>
              </div>

              {user ? (
                <Link
                  to="/admin"
                  className="block text-center text-xs text-stayora-gold py-2 border border-stayora-gold/30 rounded"
                >
                  Go to Staff Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="block text-center text-xs text-stayora-sand/60 hover:text-stayora-gold py-2"
                >
                  Staff Login Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
