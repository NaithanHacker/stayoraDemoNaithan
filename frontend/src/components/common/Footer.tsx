import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Globe, Share2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // In demo mode or if already subscribed, display success
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-stayora-navy text-stayora-sand-light pt-16 pb-8 border-t border-stayora-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Ethos Banner */}
        <div className="pb-14 border-b border-stayora-navy-surface/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-stayora-gold text-xs uppercase tracking-[0.2em] font-semibold">
              The Stayora Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-1">
              Curated Escapes & Seasonal Privileges
            </h3>
            <p className="text-stayora-sand/70 text-sm mt-2 max-w-xl">
              Receive private invitations to seasonal culinary harvests, wellness retreats, and exclusive sanctuary package privileges.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-stayora-navy-light/80 border border-stayora-gold/40 rounded text-stayora-gold text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thank you. You have been added to our private guest registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-stayora-navy-light/70 border border-stayora-gold/30 rounded-sm px-4 py-2.5 text-sm text-stayora-sand placeholder-stayora-sand/40 focus:outline-none focus:border-stayora-gold"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            {errorMsg && <p className="text-xs text-red-400 mt-1">{errorMsg}</p>}
          </div>
        </div>

        {/* Middle Navigation & Details Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-stayora-gold/50 flex items-center justify-center bg-stayora-navy-light">
                <span className="font-serif text-stayora-gold text-xl font-bold">S</span>
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-stayora-sand-light uppercase block">
                  {settings.site_name}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-stayora-gold uppercase font-light">
                  {settings.tagline}
                </span>
              </div>
            </div>

            <p className="text-stayora-sand/70 text-sm leading-relaxed max-w-sm">
              An architectural mountain sanctuary rooted in mindful luxury, pristine nature, and timeless Indian hospitality. Designed for those seeking true solace and elevated living.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a href="#sanctuary" className="w-8 h-8 rounded-full border border-stayora-gold/30 flex items-center justify-center text-stayora-sand hover:text-stayora-gold hover:border-stayora-gold transition-colors" title="Global Sanctuary">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#share" className="w-8 h-8 rounded-full border border-stayora-gold/30 flex items-center justify-center text-stayora-sand hover:text-stayora-gold hover:border-stayora-gold transition-colors" title="Share Experience">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-stayora-gold font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-stayora-sand/80">
              <li><Link to="/rooms" className="hover:text-stayora-gold transition-colors">Rooms & Suites</Link></li>
              <li><Link to="/experiences" className="hover:text-stayora-gold transition-colors">Fine Dining & Aura</Link></li>
              <li><Link to="/experiences" className="hover:text-stayora-gold transition-colors">Soma Ayurvedic Spa</Link></li>
              <li><Link to="/gallery" className="hover:text-stayora-gold transition-colors">Visual Gallery</Link></li>
              <li><Link to="/about" className="hover:text-stayora-gold transition-colors">Architecture & Heritage</Link></li>
            </ul>
          </div>

          {/* Column 3: The Sanctuary */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-stayora-gold font-semibold mb-4">
              Accommodations
            </h4>
            <ul className="space-y-2.5 text-sm text-stayora-sand/80">
              <li><Link to="/rooms/deluxe-garden-suite" className="hover:text-stayora-gold transition-colors">Deluxe Garden Suite</Link></li>
              <li><Link to="/rooms/executive-valley-suite" className="hover:text-stayora-gold transition-colors">Executive Valley Suite</Link></li>
              <li><Link to="/rooms/private-pool-villa" className="hover:text-stayora-gold transition-colors">Private Pool Villa</Link></li>
              <li><Link to="/rooms/presidential-grand-pavilion" className="hover:text-stayora-gold transition-colors">Presidential Pavilion</Link></li>
              <li><Link to="/rooms/canopy-treehouse-villa" className="hover:text-stayora-gold transition-colors">Canopy Treehouse Villa</Link></li>
            </ul>
          </div>

          {/* Column 4: Concierge & Sanctuary Address */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-stayora-gold font-semibold mb-4">
              Concierge
            </h4>
            <div className="space-y-3 text-xs text-stayora-sand/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stayora-gold flex-shrink-0 mt-0.5" />
                <span>
                  {settings.address_line1}, {settings.address_line2}, {settings.city}, {settings.state} {settings.postal_code}, {settings.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stayora-gold flex-shrink-0" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-stayora-gold">{settings.contact_phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stayora-gold flex-shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-stayora-gold">{settings.contact_email}</a>
              </div>
              <div className="pt-2 text-[11px] text-stayora-sand/60">
                Check-in: {settings.check_in_time} | Check-out: {settings.check_out_time}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer Box */}
        <div className="my-6 p-4 rounded bg-stayora-navy-light/60 border border-stayora-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stayora-sand/70">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-stayora-gold flex-shrink-0" />
            <span>
              <strong>Demonstration Notice:</strong> STAYORA is a fictional luxury hospitality digital product built for portfolio demonstration. No financial transactions take place, and inquiries are stored for preview purposes only.
            </span>
          </div>
          <Link to="/admin/login" className="text-stayora-gold hover:underline whitespace-nowrap font-medium">
            Staff Administrative Login →
          </Link>
        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 border-t border-stayora-navy-surface/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stayora-sand/50 gap-4">
          <p>© {new Date().getFullYear()} {settings.site_name} Hospitality Group. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-stayora-sand cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stayora-sand cursor-pointer">Terms of Stay</span>
            <span className="hover:text-stayora-sand cursor-pointer">Accessibility</span>
            <span className="hover:text-stayora-sand cursor-pointer">Sustainability Charter</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
