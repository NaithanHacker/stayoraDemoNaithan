import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Compass, Search, AlertCircle } from 'lucide-react';

interface BookingSearchBarProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialCategory?: string;
  className?: string;
}

export const BookingSearchBar: React.FC<BookingSearchBarProps> = ({
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  initialCategory = 'all',
  className = '',
}) => {
  const navigate = useNavigate();

  // Helper for formatted ISO date
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || getFormattedDate(2));
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || getFormattedDate(5));
  const [guests, setGuests] = useState<number>(initialGuests);
  const [category, setCategory] = useState<string>(initialCategory);
  const [dateError, setDateError] = useState<string>('');

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIn = e.target.value;
    setCheckIn(newIn);
    if (checkOut && newIn >= checkOut) {
      // automatically push checkout 2 days forward
      const d = new Date(newIn);
      d.setDate(d.getDate() + 2);
      setCheckOut(d.toISOString().split('T')[0]);
      setDateError('');
    } else {
      setDateError('');
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOut = e.target.value;
    if (newOut <= checkIn) {
      setDateError('Check-out date must be strictly after check-in.');
    } else {
      setDateError('');
    }
    setCheckOut(newOut);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkOut <= checkIn) {
      setDateError('Check-out date must be strictly after check-in.');
      return;
    }
    setDateError('');

    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', String(guests));

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className={`relative ${className}`}>
      <form
        onSubmit={handleSearch}
        className="glass-luxury-dark text-stayora-sand-light rounded-md p-4 sm:p-5 shadow-luxury border border-stayora-gold/25"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Check-In Date */}
          <div className="flex flex-col space-y-1.5 px-3 py-2 rounded bg-stayora-navy/60 border border-stayora-gold/15 hover:border-stayora-gold/40 transition-colors">
            <label className="text-[10px] uppercase tracking-widest text-stayora-gold font-semibold flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-stayora-gold" /> Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleCheckInChange}
              className="bg-transparent text-sm font-medium text-stayora-sand-light focus:outline-none cursor-pointer [color-scheme:dark]"
              required
            />
          </div>

          {/* Check-Out Date */}
          <div className="flex flex-col space-y-1.5 px-3 py-2 rounded bg-stayora-navy/60 border border-stayora-gold/15 hover:border-stayora-gold/40 transition-colors">
            <label className="text-[10px] uppercase tracking-widest text-stayora-gold font-semibold flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-stayora-gold" /> Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={handleCheckOutChange}
              className="bg-transparent text-sm font-medium text-stayora-sand-light focus:outline-none cursor-pointer [color-scheme:dark]"
              required
            />
          </div>

          {/* Guests & Category */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1.5 px-3 py-2 rounded bg-stayora-navy/60 border border-stayora-gold/15 hover:border-stayora-gold/40 transition-colors">
              <label className="text-[10px] uppercase tracking-widest text-stayora-gold font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-stayora-gold" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                className="bg-stayora-navy text-xs font-medium text-stayora-sand-light focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={6}>6 Guests</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5 px-3 py-2 rounded bg-stayora-navy/60 border border-stayora-gold/15 hover:border-stayora-gold/40 transition-colors">
              <label className="text-[10px] uppercase tracking-widest text-stayora-gold font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3 text-stayora-gold" /> Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-stayora-navy text-xs font-medium text-stayora-sand-light focus:outline-none cursor-pointer"
              >
                <option value="all">All Suites</option>
                <option value="suites">Suites</option>
                <option value="villas">Villas</option>
                <option value="pavilions">Pavilions</option>
                <option value="cottages">Cottages</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="h-full flex items-end">
            <button
              type="submit"
              className="w-full btn-gold py-3.5 px-6 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Explore Availability</span>
            </button>
          </div>
        </div>

        {dateError && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-300 bg-red-950/40 p-2 rounded border border-red-800/40">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{dateError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
