import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize2, BedDouble, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Room } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface RoomCardProps {
  room: Room;
  onBookNow: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBookNow }) => {
  const { formatPrice } = useSettings();

  return (
    <div className="group bg-stayora-navy border border-stayora-gold/20 rounded-lg overflow-hidden shadow-luxury hover:border-stayora-gold/50 transition-all duration-300 flex flex-col">
      
      {/* Image with zoom on hover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stayora-navy-deep">
        <img
          src={room.primary_image}
          alt={room.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy via-transparent to-black/30" />

        {/* Category & Featured Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded bg-stayora-navy/85 backdrop-blur-md text-[11px] uppercase tracking-wider text-stayora-gold font-semibold border border-stayora-gold/30">
            {room.category_name || 'Suite'}
          </span>
          {room.is_featured && (
            <span className="px-2 py-0.5 rounded bg-stayora-gold/90 text-stayora-navy text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Signature
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 text-right">
          <div className="text-[10px] uppercase tracking-wider text-stayora-sand/70">From</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-stayora-sand-light">
            {formatPrice(room.price_per_night)}
            <span className="text-xs font-sans font-normal text-stayora-sand/70"> / night</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-stayora-sand-light group-hover:text-stayora-gold transition-colors">
            {room.title}
          </h3>
          <p className="text-stayora-sand/70 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
            {room.short_description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-stayora-gold/15 text-xs text-stayora-sand/80">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-stayora-gold flex-shrink-0" />
              <span>{room.size_sqft} sq ft</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stayora-gold flex-shrink-0" />
              <span>Up to {room.capacity} guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-stayora-gold flex-shrink-0" />
              <span className="truncate">{room.bed_type}</span>
            </div>
          </div>

          {/* Key Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity.id}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stayora-navy-light text-stayora-sand/80 border border-stayora-gold/15"
              >
                {amenity.name}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-stayora-gold/80">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <Link
            to={`/rooms/${room.slug}`}
            className="flex-1 py-2.5 px-3 rounded-sm border border-stayora-gold/30 hover:border-stayora-gold text-stayora-sand hover:text-stayora-gold text-xs uppercase tracking-wider font-medium text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onBookNow(room)}
            className="flex-1 btn-gold py-2.5 px-3 rounded-sm text-xs uppercase tracking-wider font-semibold text-center flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Rates</span>
          </button>
        </div>

        <div className="text-[10px] text-stayora-sand/40 text-center tracking-wide italic">
          * Realistic demonstration tariff. Inclusive of estate breakfast.
        </div>
      </div>
    </div>
  );
};
