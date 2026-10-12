import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Room, RoomCategory } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { RoomCard } from '../components/common/RoomCard';
import { BookingSearchBar } from '../components/common/BookingSearchBar';

interface RoomsPageProps {
  onOpenBooking: (room?: Room) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onOpenBooking }) => {
  const [searchParams] = useSearchParams();
  const { formatPrice } = useSettings();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [guestsFilter, setGuestsFilter] = useState<number>(parseInt(searchParams.get('guests') || '0', 10));
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [cats, roomsData] = await Promise.all([
          api.getCategories(),
          api.getRooms(),
        ]);
        setCategories(cats);
        setRooms(roomsData);
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  // Filter & sort logic
  const filteredRooms = rooms
    .filter((room) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          room.category_slug.toLowerCase() === selectedCategory.toLowerCase() ||
          room.category_name.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }
      // Capacity filter
      if (guestsFilter > 0 && room.capacity < guestsFilter) {
        return false;
      }
      // Max price
      if (Number(room.price_per_night) > maxPrice) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') {
        return Number(a.price_per_night) - Number(b.price_per_night);
      } else if (sortBy === 'price_desc') {
        return Number(b.price_per_night) - Number(a.price_per_night);
      } else if (sortBy === 'capacity') {
        return b.capacity - a.capacity;
      } else if (sortBy === 'size') {
        return b.size_sqft - a.size_sqft;
      }
      // Default: featured first
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  const resetFilters = () => {
    setSelectedCategory('all');
    setGuestsFilter(0);
    setMaxPrice(100000);
    setSortBy('featured');
  };

  return (
    <div className="bg-stayora-ivory min-h-screen pt-28 pb-24 text-stayora-charcoal">
      {/* Header Banner */}
      <div className="bg-stayora-navy text-stayora-sand-light py-16 px-4 sm:px-6 lg:px-8 border-b border-stayora-gold/20 mb-12">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Bespoke Residences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-stayora-sand-light">
            Rooms & Sanctuary Suites
          </h1>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Explore our collection of cliffside suites, secluded private heated pool villas, and grand presidential pavilions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Dates Bar */}
        <div className="mb-12">
          <BookingSearchBar
            initialCategory={selectedCategory}
            initialGuests={guestsFilter > 0 ? guestsFilter : 2}
          />
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-lg border border-stayora-gold/20 shadow-subtle mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-stayora-navy flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-stayora-gold-dark" /> Collection:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'all'
                    ? 'btn-gold font-semibold'
                    : 'bg-stayora-sand-light text-stayora-charcoal/80 hover:bg-stayora-sand'
                }`}
              >
                All Accommodations ({rooms.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider transition-all ${
                    selectedCategory === c.slug
                      ? 'btn-gold font-semibold'
                      : 'bg-stayora-sand-light text-stayora-charcoal/80 hover:bg-stayora-sand'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Sort & Guest Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stayora-charcoal/70 whitespace-nowrap">Capacity:</span>
                <select
                  value={guestsFilter}
                  onChange={(e) => setGuestsFilter(parseInt(e.target.value, 10))}
                  className="bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-2.5 py-1 text-xs text-stayora-charcoal focus:outline-none"
                >
                  <option value={0}>Any Occupancy</option>
                  <option value={2}>2+ Guests</option>
                  <option value={3}>3+ Guests</option>
                  <option value={4}>4+ Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stayora-charcoal/70 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-2.5 py-1 text-xs text-stayora-charcoal focus:outline-none"
                >
                  <option value="featured">Signature & Featured</option>
                  <option value="price_asc">Tariff: Low to High</option>
                  <option value="price_desc">Tariff: High to Low</option>
                  <option value="capacity">Guest Capacity</option>
                  <option value="size">Floor Area (Sq Ft)</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || guestsFilter > 0 || maxPrice < 100000 || sortBy !== 'featured') && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-stayora-gold-dark hover:underline flex items-center gap-1 ml-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stayora-charcoal/70">
          <span>
            Showing <strong>{filteredRooms.length}</strong> luxurious residences available for reservation
          </span>
          <span className="italic text-stayora-gold-dark">
            * All tariffs in INR with breakfast and estate amenities included
          </span>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-stayora-sand/50 animate-pulse" />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stayora-gold/20 p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-stayora-gold-dark mx-auto" />
            <h3 className="font-serif text-2xl text-stayora-navy">No Accommodations Match Criteria</h3>
            <p className="text-xs text-stayora-charcoal/70 max-w-md mx-auto">
              Please adjust your guest capacity or category filters to explore our available suites and pool villas.
            </p>
            <button
              onClick={resetFilters}
              className="btn-gold px-5 py-2 rounded text-xs uppercase tracking-wider font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBookNow={() => onOpenBooking(room)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
