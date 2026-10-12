import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, ShieldAlert, CheckCircle2, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { Room, BookingInquiry } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom?: Room | null;
  rooms?: Room[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedRoom,
  rooms = [],
}) => {
  const { settings, formatPrice, getWhatsAppUrl } = useSettings();

  // Helper date
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [roomId, setRoomId] = useState<number | string>(selectedRoom?.id || '');
  const [activeRoom, setActiveRoom] = useState<Room | null>(selectedRoom || null);
  const [checkIn, setCheckIn] = useState<string>(getFormattedDate(3));
  const [checkOut, setCheckOut] = useState<string>(getFormattedDate(6));
  const [guests, setGuests] = useState<number>(2);
  const [numRooms, setNumRooms] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successInquiry, setSuccessInquiry] = useState<BookingInquiry | null>(null);

  // Sync selected room when prop changes
  useEffect(() => {
    if (selectedRoom) {
      setRoomId(selectedRoom.id);
      setActiveRoom(selectedRoom);
    } else if (rooms.length > 0 && !roomId) {
      setRoomId(rooms[0].id);
      setActiveRoom(rooms[0]);
    }
  }, [selectedRoom, rooms]);

  const handleRoomSelect = (id: string | number) => {
    setRoomId(id);
    const found = rooms.find(r => String(r.id) === String(id));
    if (found) setActiveRoom(found);
  };

  // Calculate nights & price breakdown
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const pricePerNight = activeRoom ? Number(activeRoom.price_per_night) : 0;
  const subtotal = pricePerNight * (nights > 0 ? nights : 1) * numRooms;
  const taxPercentage = activeRoom ? Number(activeRoom.tax_percentage) : 18;
  const tax = subtotal * (taxPercentage / 100);
  const grandTotal = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nights <= 0) {
      setErrorMsg('Check-out date must be strictly after the check-in date.');
      return;
    }
    if (!guestName || !guestEmail || !guestPhone) {
      setErrorMsg('Please complete all required guest contact fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload: BookingInquiry = {
        room: typeof roomId === 'number' ? roomId : parseInt(roomId, 10) || null,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: guests,
        num_rooms: numRooms,
        special_requests: specialRequests,
      };

      const res = await api.createBookingInquiry(payload);
      setSuccessInquiry(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit booking inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-stayora-navy border border-stayora-gold/30 rounded-lg max-w-2xl w-full text-stayora-sand-light shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stayora-navy-surface flex items-center justify-between bg-stayora-navy-deep">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
              Reservation Concierge
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-stayora-sand-light">
              {successInquiry ? 'Booking Inquiry Received' : 'Inquire for Your Stay'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stayora-sand/60 hover:text-stayora-sand hover:bg-stayora-navy-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Environment Notice Pill */}
        <div className="bg-stayora-navy-surface/80 px-6 py-2.5 border-b border-stayora-gold/15 flex items-center gap-2 text-xs text-stayora-gold">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Simulated Booking Environment:</strong> This request is registered as a demo booking inquiry. No payment card details are collected or stored.
          </span>
        </div>

        {successInquiry ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stayora-gold/15 border border-stayora-gold flex items-center justify-center text-stayora-gold">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl text-stayora-sand-light">
                Inquiry Successfully Logged
              </h3>
              <p className="text-stayora-sand/80 text-sm max-w-md mx-auto">
                Thank you, <strong className="text-stayora-sand-light">{successInquiry.guest_name}</strong>. Your inquiry has been registered in the STAYORA staff management system.
              </p>
            </div>

            <div className="bg-stayora-navy-deep/80 rounded p-4 border border-stayora-gold/20 text-xs space-y-2 text-stayora-sand/90">
              <div className="flex justify-between py-1 border-b border-stayora-gold/10">
                <span className="text-stayora-sand/60">Reference Inquiry ID:</span>
                <span className="font-mono text-stayora-gold">#STAY-{successInquiry.id || 'DEMO-001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stayora-gold/10">
                <span className="text-stayora-sand/60">Selected Suite:</span>
                <span className="font-semibold text-stayora-sand-light">{successInquiry.room_name_snapshot || activeRoom?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stayora-gold/10">
                <span className="text-stayora-sand/60">Dates of Stay:</span>
                <span>{successInquiry.check_in} to {successInquiry.check_out} ({successInquiry.total_nights || nights} nights)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stayora-gold/10">
                <span className="text-stayora-sand/60">Estimated Total (incl. GST):</span>
                <span className="font-serif text-stayora-gold text-sm font-semibold">{formatPrice(successInquiry.estimated_total || grandTotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stayora-sand/60">Inquiry Status:</span>
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-semibold text-[11px]">
                  Pending Staff Confirmation
                </span>
              </div>
            </div>

            <p className="text-xs text-stayora-sand/60 text-center italic">
              Note: A reservation is confirmed only once our reservations team reviews room allotment and contacts you via phone or email.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={getWhatsAppUrl(activeRoom?.title, checkIn, checkOut, guests)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-gold py-3 px-4 rounded-sm text-center text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Follow Up via WhatsApp Concierge</span>
              </a>
              <button
                onClick={onClose}
                className="btn-navy py-3 px-6 rounded-sm text-xs uppercase tracking-wider font-medium text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Inquiry Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Room Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stayora-gold font-semibold">
                Accommodation Choice
              </label>
              {rooms.length > 0 ? (
                <select
                  value={roomId}
                  onChange={(e) => handleRoomSelect(e.target.value)}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3.5 py-2.5 text-sm text-stayora-sand-light focus:outline-none focus:border-stayora-gold"
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} — {formatPrice(r.price_per_night)} / night
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2.5 bg-stayora-navy-deep rounded text-sm text-stayora-sand">
                  {activeRoom ? activeRoom.title : 'Luxury Suite Selected'}
                </div>
              )}
            </div>

            {/* Dates & Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Check-In Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3 py-2 text-sm text-stayora-sand-light focus:outline-none [color-scheme:dark]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Check-Out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3 py-2 text-sm text-stayora-sand-light focus:outline-none [color-scheme:dark]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3 py-2 text-sm text-stayora-sand-light focus:outline-none"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5 Guests</option>
                  <option value={6}>6 Guests</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stayora-gold font-semibold">
                  Number of Suites / Units
                </label>
                <select
                  value={numRooms}
                  onChange={(e) => setNumRooms(parseInt(e.target.value, 10))}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3 py-2 text-sm text-stayora-sand-light focus:outline-none"
                >
                  <option value={1}>1 Suite</option>
                  <option value={2}>2 Suites</option>
                  <option value={3}>3 Suites</option>
                </select>
              </div>
            </div>

            {/* Guest Contact Details */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs uppercase tracking-wider text-stayora-sand font-semibold">
                Guest Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3.5 py-2 text-sm text-stayora-sand placeholder-stayora-sand/40 focus:outline-none focus:border-stayora-gold"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3.5 py-2 text-sm text-stayora-sand placeholder-stayora-sand/40 focus:outline-none focus:border-stayora-gold"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone / WhatsApp Number (e.g. +91 98765 43210) *"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3.5 py-2 text-sm text-stayora-sand placeholder-stayora-sand/40 focus:outline-none focus:border-stayora-gold"
                required
              />
              <textarea
                placeholder="Special requests, dietary preferences, celebratory occasions, arrival timing..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                className="w-full bg-stayora-navy-deep border border-stayora-gold/30 rounded px-3.5 py-2 text-sm text-stayora-sand placeholder-stayora-sand/40 focus:outline-none focus:border-stayora-gold resize-none"
              />
            </div>

            {/* Live Transparent Price Breakdown */}
            <div className="bg-stayora-navy-deep/90 border border-stayora-gold/25 rounded p-4 text-xs space-y-2">
              <div className="flex justify-between text-stayora-sand/80">
                <span>Room Rate ({nights} nights × {numRooms} suite):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stayora-sand/80">
                <span>Hospitality GST ({taxPercentage}%):</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stayora-gold/15 text-sm font-semibold text-stayora-sand-light">
                <span>Total Estimated Tariff:</span>
                <span className="font-serif text-stayora-gold text-base">{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[11px] text-stayora-sand/50 italic pt-1">
                Transparent pricing in {settings.currency_code}. No hidden resort fees. Includes daily farm-to-table breakfast and evening tea.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-gold py-3.5 px-6 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Booking Inquiry'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppUrl(activeRoom?.title, checkIn, checkOut, guests)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy py-3 px-4 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                title="Instant WhatsApp assistance"
              >
                <MessageSquare className="w-4 h-4 text-stayora-gold" />
                <span>WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
