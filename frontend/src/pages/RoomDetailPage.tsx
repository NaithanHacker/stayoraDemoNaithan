import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, Maximize2, BedDouble, Calendar, ArrowLeft,
  Sparkles, Check, MessageSquare, ShieldAlert,
  ArrowRight, HeartHandshake, Eye, AlertCircle
} from 'lucide-react';
import { Room } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

interface RoomDetailPageProps {
  onOpenBooking: (room: Room) => void;
}

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ onOpenBooking }) => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice, getWhatsAppUrl, settings } = useSettings();

  const [room, setRoom] = useState<Room | null>(null);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Local reservation calculator state
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState<string>(getFormattedDate(3));
  const [checkOut, setCheckOut] = useState<string>(getFormattedDate(6));
  const [guests, setGuests] = useState<number>(2);
  const [units, setUnits] = useState<number>(1);
  const [dateError, setDateError] = useState<string>('');

  useEffect(() => {
    async function loadRoom() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await api.getRoomBySlug(slug);
        setRoom(data);
        setSelectedImg(data.primary_image);
      } catch (err: any) {
        setError(err.message || 'Room not found');
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [slug]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const pricePerNight = room ? Number(room.price_per_night) : 0;
  const subtotal = pricePerNight * (nights > 0 ? nights : 1) * units;
  const taxRate = room ? Number(room.tax_percentage) : 18;
  const tax = subtotal * (taxRate / 100);
  const totalTariff = subtotal + tax;

  const handleDateChange = (type: 'in' | 'out', val: string) => {
    if (type === 'in') {
      setCheckIn(val);
      if (checkOut && val >= checkOut) {
        const next = new Date(val);
        next.setDate(next.getDate() + 2);
        setCheckOut(next.toISOString().split('T')[0]);
        setDateError('');
      }
    } else {
      if (val <= checkIn) {
        setDateError('Check-out date must be strictly after check-in.');
      } else {
        setDateError('');
      }
      setCheckOut(val);
    }
  };

  if (loading) {
    return (
      <div className="bg-stayora-ivory min-h-screen pt-36 pb-24 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-stayora-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-stayora-navy text-lg">Unveiling Accommodation Details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="bg-stayora-ivory min-h-screen pt-36 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="font-serif text-3xl text-stayora-navy">Accommodation Not Found</h2>
        <p className="text-sm text-stayora-charcoal/70">{error || 'This suite or villa is not listed in our current catalog.'}</p>
        <Link to="/rooms" className="btn-gold px-6 py-2.5 rounded-sm inline-block text-xs uppercase tracking-wider font-semibold">
          Return to All Rooms
        </Link>
      </div>
    );
  }

  const galleryImages = [
    room.primary_image,
    ...(room.gallery_images?.map((g) => g.image_url) || [])
  ];

  const whatsappHref = getWhatsAppUrl(room.title, checkIn, checkOut, guests);

  return (
    <div className="bg-stayora-ivory min-h-screen pt-24 pb-24 text-stayora-charcoal">
      
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stayora-navy hover:text-stayora-gold-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Accommodations</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-stayora-gold/20 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-stayora-navy text-stayora-gold text-[11px] font-semibold uppercase tracking-wider">
                {room.category_name}
              </span>
              <span className="text-xs text-stayora-charcoal/60">
                View: {room.view}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-stayora-navy">
              {room.title}
            </h1>
            <p className="text-stayora-charcoal/70 text-sm mt-2 max-w-2xl">
              {room.short_description}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-wider text-stayora-charcoal/60 block">Base Nightly Tariff</span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stayora-navy">
              {formatPrice(room.price_per_night)}
              <span className="text-sm font-sans font-normal text-stayora-charcoal/60"> / night</span>
            </div>
            <span className="text-[11px] text-stayora-gold-dark font-medium block">
              + {room.tax_percentage}% Hospitality GST
            </span>
          </div>
        </div>

        {/* Image Gallery Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
          {/* Main Large Image */}
          <div className="lg:col-span-9 h-[420px] sm:h-[520px] rounded-lg overflow-hidden border border-stayora-gold/30 shadow-luxury bg-stayora-navy-deep relative">
            <img
              src={selectedImg}
              alt={room.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 right-4 px-3 py-1 rounded bg-stayora-navy/80 backdrop-blur-md text-stayora-sand-light text-xs flex items-center gap-1.5 border border-stayora-gold/20">
              <Eye className="w-3.5 h-3.5 text-stayora-gold" />
              <span>High-Definition Photography</span>
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[520px]">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(img)}
                className={`relative rounded-md overflow-hidden flex-shrink-0 h-24 lg:h-[120px] w-36 lg:w-full border-2 transition-all ${
                  selectedImg === img
                    ? 'border-stayora-gold shadow-gold-glow scale-[1.02]'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Details + Sticky Reservation Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Full Room Specs & Amenities */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-4 p-6 rounded-lg bg-white border border-stayora-gold/20 shadow-subtle text-center">
              <div>
                <Maximize2 className="w-5 h-5 text-stayora-gold-dark mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 block">Dimensions</span>
                <span className="font-serif text-lg font-semibold text-stayora-navy">{room.size_sqft} sq ft</span>
              </div>
              <div>
                <Users className="w-5 h-5 text-stayora-gold-dark mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 block">Occupancy</span>
                <span className="font-serif text-lg font-semibold text-stayora-navy">{room.capacity} Guests</span>
              </div>
              <div>
                <BedDouble className="w-5 h-5 text-stayora-gold-dark mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 block">Bed Type</span>
                <span className="font-serif text-lg font-semibold text-stayora-navy">{room.bed_type}</span>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-stayora-navy">
                The Living Space
              </h2>
              <div className="text-stayora-charcoal/80 text-sm leading-relaxed space-y-3 font-light">
                <p>{room.full_description || room.short_description}</p>
                <p>
                  Architecturally aligned to capture sunrise mist and evening breezes, every surface reflects organic materiality. Hand-honed granite, seasoned teak cabinetry, and floor-to-ceiling panoramic glass invite the mountain landscape inward while preserving absolute acoustic peace.
                </p>
              </div>
            </div>

            {/* In-Suite Amenities */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-stayora-navy">
                Residence Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-3.5 rounded bg-white border border-stayora-gold/20 flex items-center gap-3 text-xs text-stayora-charcoal/90 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-stayora-sand-light flex items-center justify-center text-stayora-gold-dark flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block">{amenity.name}</span>
                      <span className="text-[10px] text-stayora-charcoal/60">{amenity.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Privileges */}
            <div className="p-6 rounded-lg bg-stayora-sand-light border border-stayora-gold/25 space-y-3 text-xs text-stayora-charcoal/80">
              <h3 className="font-serif text-base text-stayora-navy font-semibold flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-stayora-gold-dark" /> The Stayora Privilege Inclusions
              </h3>
              <ul className="space-y-2 list-disc pl-4">
                <li>Check-in: {settings.check_in_time} | Check-out: {settings.check_out_time}</li>
                <li>Artisanal farm-to-table breakfast served daily at Aura or in-suite</li>
                <li>Evening high tea with estate single-origin coffee and regional delicacies</li>
                <li>Complimentary high-speed satellite Wi-Fi across the sanctuary grounds</li>
                <li>24/7 dedicated butler and concierge team</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Reservation & Price Calculator */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-stayora-navy text-stayora-sand-light rounded-lg border border-stayora-gold/30 shadow-2xl p-6 sm:p-7 space-y-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                  Transparent Tariff Breakdown
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="font-serif text-2xl text-stayora-sand-light">
                    {formatPrice(room.price_per_night)}
                  </h3>
                  <span className="text-xs text-stayora-sand/70 font-light">per night</span>
                </div>
              </div>

              {/* Date pickers with validation */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange('in', e.target.value)}
                    className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded p-2 text-stayora-sand-light focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => handleDateChange('out', e.target.value)}
                    className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded p-2 text-stayora-sand-light focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {dateError && (
                <div className="p-2 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded">
                  {dateError}
                </div>
              )}

              {/* Guests and units */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded p-2 text-stayora-sand-light focus:outline-none"
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold">
                    Suites
                  </label>
                  <select
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value, 10))}
                    className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded p-2 text-stayora-sand-light focus:outline-none"
                  >
                    <option value={1}>1 Suite</option>
                    <option value={2}>2 Suites</option>
                  </select>
                </div>
              </div>

              {/* Live Transparent Price Breakdown Box */}
              <div className="bg-stayora-navy-deep/80 rounded p-4 border border-stayora-gold/20 text-xs space-y-2.5">
                <div className="flex justify-between text-stayora-sand/80">
                  <span>{formatPrice(room.price_per_night)} × {nights} {nights === 1 ? 'night' : 'nights'}:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stayora-sand/80">
                  <span>Hospitality GST ({taxRate}%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-stayora-gold/20 flex justify-between items-center text-sm font-semibold">
                  <span>Estimated Total Tariff:</span>
                  <span className="font-serif text-stayora-gold text-lg">{formatPrice(totalTariff)}</span>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => onOpenBooking(room)}
                  className="w-full btn-gold py-3.5 px-4 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Booking Inquiry</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-navy py-3 px-4 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-stayora-gold" />
                  <span>Inquire via WhatsApp Desk</span>
                </a>
              </div>

              {/* Demo Notice */}
              <div className="flex items-center gap-2 text-[11px] text-stayora-sand/60 pt-2 border-t border-stayora-gold/10">
                <ShieldAlert className="w-3.5 h-3.5 text-stayora-gold flex-shrink-0" />
                <span>
                  Simulated booking preview. No credit card details required.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
