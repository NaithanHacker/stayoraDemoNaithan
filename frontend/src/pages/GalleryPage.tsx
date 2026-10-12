import React, { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../types';
import { api } from '../services/api';
import { Lightbox } from '../components/common/Lightbox';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Rooms', 'Dining', 'Wellness', 'Grounds', 'Architecture'];

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const data = await api.getGallery();
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-stayora-ivory min-h-screen pt-28 pb-24 text-stayora-charcoal">
      
      {/* Header Banner */}
      <div className="bg-stayora-navy text-stayora-sand-light py-20 px-4 sm:px-6 lg:px-8 border-b border-stayora-gold/20 mb-12">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Visual Anthology
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stayora-sand-light">
            Sanctuary in Frames
          </h1>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Immerse yourself in the interplay of raw granite, warm indigenous rosewood, and mist-laden valley horizons.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-stayora-navy text-stayora-gold font-semibold shadow-luxury border border-stayora-gold'
                  : 'bg-white text-stayora-charcoal/80 hover:text-stayora-navy border border-stayora-gold/20 hover:border-stayora-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="h-80 rounded-lg bg-stayora-sand/50 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-stayora-navy">No photographs in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative h-80 rounded-lg overflow-hidden bg-stayora-navy cursor-pointer border border-stayora-gold/20 shadow-subtle hover:shadow-luxury hover:border-stayora-gold transition-all duration-300"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy via-stayora-navy/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Hover overlay content */}
                <div className="absolute bottom-4 left-4 right-4 text-stayora-sand-light transition-transform duration-300">
                  <span className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-stayora-sand-light group-hover:text-stayora-gold transition-colors">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-stayora-sand/80 line-clamp-2 mt-1">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="absolute top-3 right-3 p-2 rounded-full bg-stayora-navy/80 text-stayora-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredItems}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
      />
    </div>
  );
};
