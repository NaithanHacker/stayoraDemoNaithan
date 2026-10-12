import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handleNext = () => {
    onNavigate((currentIndex + 1) % items.length);
  };

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-stayora-sand-light z-10">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-stayora-navy-light text-stayora-gold text-xs uppercase tracking-wider font-semibold border border-stayora-gold/20">
            {currentItem?.category}
          </span>
          <span className="text-xs text-stayora-sand/60">
            {currentIndex + 1} of {items.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-stayora-navy-light/80 hover:bg-stayora-navy text-stayora-sand hover:text-stayora-gold transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-stayora-navy/80 hover:bg-stayora-gold hover:text-stayora-navy text-stayora-sand transition-all"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={currentItem?.image_url}
          alt={currentItem?.title}
          className="max-h-[78vh] max-w-[90vw] object-contain rounded-md shadow-2xl transition-all duration-300"
        />

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-stayora-navy/80 hover:bg-stayora-gold hover:text-stayora-navy text-stayora-sand transition-all"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption & Title */}
      <div className="text-center text-stayora-sand-light max-w-xl mx-auto z-10 pb-2">
        <h3 className="font-serif text-lg sm:text-xl text-stayora-sand-light">
          {currentItem?.title}
        </h3>
        {currentItem?.caption && (
          <p className="text-xs sm:text-sm text-stayora-sand/70 mt-1">
            {currentItem.caption}
          </p>
        )}
      </div>
    </div>
  );
};
