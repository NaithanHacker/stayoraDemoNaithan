import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Compass, ShieldCheck, HeartHandshake,
  Coffee, Award, ArrowRight, Quote, MapPin, CheckCircle2,
  Calendar, Waves, UtensilsCrossed, Flower2, TreePine
} from 'lucide-react';
import { Room, GalleryItem, SpecialOffer } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { BookingSearchBar } from '../components/common/BookingSearchBar';
import { RoomCard } from '../components/common/RoomCard';
import { Lightbox } from '../components/common/Lightbox';

interface HomePageProps {
  onOpenBooking: (room?: Room) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking }) => {
  const { settings } = useSettings();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [activeGalleryCat, setActiveGalleryCat] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsData, galleryData, offersData] = await Promise.all([
          api.getRooms({ featured: true }),
          api.getGallery(),
          api.getOffers(),
        ]);
        setRooms(roomsData.slice(0, 4));
        setGalleryItems(galleryData);
        setOffers(offersData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredGallery = activeGalleryCat === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category.toLowerCase() === activeGalleryCat.toLowerCase());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const experiences = [
    {
      title: "Aura Fine Dining & Terroir",
      category: "Epicurean Journey",
      icon: <UtensilsCrossed className="w-5 h-5 text-stayora-gold" />,
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
      description: "An open-hearth culinary pavilion celebrating centuries-old regional spice recipes reinterpreted through modern gastronomy. Ingredients harvested daily from our organic forest gardens.",
      highlight: "8-Course Chef’s Degustation & Vintage Cellar Pairings"
    },
    {
      title: "Escarpment Horizon Pool",
      category: "Aqua Sanctuary",
      icon: <Waves className="w-5 h-5 text-stayora-gold" />,
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
      description: "A cantilevered infinity swimming pool heated by geothermal power, floating effortlessly over mist-shrouded valleys. Bask on poolside loungers as cloud formations drift across the mountains.",
      highlight: "Heated 28°C Year-Round & Sunset Herbal Elixirs"
    },
    {
      title: "Soma Ayurvedic Sanctuary",
      category: "Restorative Healing",
      icon: <Flower2 className="w-5 h-5 text-stayora-gold" />,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      description: "Ancient Vedic therapies guided by resident Ayurvedic physicians. Bespoke herbal oil decoctions, copper steam baths, and transcendent sound meditation along the forest rim.",
      highlight: "Abhyanga & Shirodhara Rejuvenation Rituals"
    },
    {
      title: "Ancient Forest & Coffee Trails",
      category: "Wild Wilderness",
      icon: <TreePine className="w-5 h-5 text-stayora-gold" />,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85",
      description: "Spanning 140 acres of conserved virgin biosphere. Embark on guided naturalist treks to secluded hidden waterfalls, private bamboo groves, and morning birdsong meditation.",
      highlight: "Naturalist-Led Wildlife & Plantation Walks"
    }
  ];

  const pillars = [
    {
      title: "Thoughtful Hospitality",
      icon: <HeartHandshake className="w-6 h-6 text-stayora-gold" />,
      desc: "Every interaction is grounded in quiet attentiveness, intuition, and authentic warmth without intrusion."
    },
    {
      title: "Exceptional Comfort",
      icon: <Coffee className="w-6 h-6 text-stayora-gold" />,
      desc: "Plush goose-down linens, handcrafted timber architecture, sunken soaking tubs, and custom climate zones."
    },
    {
      title: "Curated Experiences",
      icon: <Compass className="w-6 h-6 text-stayora-gold" />,
      desc: "Private tea sommelier masterclasses, stargazing pavilion nights, and tailored forest excursions."
    },
    {
      title: "Personalized Service",
      icon: <Award className="w-6 h-6 text-stayora-gold" />,
      desc: "Dedicated personal concierge and discreet butler service dedicated to anticipating every comfort."
    }
  ];

  const testimonials = [
    {
      quote: "STAYORA is the definition of tranquil luxury. Sitting on the terrace of the Private Pool Villa as morning fog rolled across the Coorg valley was one of the most serene moments of our lives.",
      author: "Aditya & Malini Deshmukh",
      location: "Mumbai",
      stayed: "Stayed in the Private Pool Villa",
    },
    {
      quote: "The culinary craft at Aura rivaled three-star Michelin establishments in Europe, yet felt deeply rooted in local forest botanicals. An unforgettable retreat from start to finish.",
      author: "Eleanor Whitmore",
      location: "London, UK",
      stayed: "Stayed in the Executive Valley Suite",
    },
    {
      quote: "Every architectural detail—from the river stone masonry to the silent infinity pool—radiates perfection. The team anticipated our needs before we even voiced them.",
      author: "Karan Johar-Mehta",
      location: "Bengaluru",
      stayed: "Stayed in the Presidential Grand Pavilion",
    }
  ];

  return (
    <div className="bg-stayora-ivory text-stayora-charcoal">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 overflow-hidden">
        {/* Cinematic Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=90"
            alt="STAYORA Luxury Sanctuary"
            className="w-full h-full object-cover scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy via-stayora-navy/60 to-stayora-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stayora-navy/30 to-stayora-navy/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto text-center pt-16 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stayora-navy/70 border border-stayora-gold/40 text-stayora-gold text-xs uppercase tracking-[0.25em] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> An Architectural Mountain Sanctuary
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-stayora-sand-light font-normal tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find Your Place to <span className="italic font-serif text-gold-gradient">Unwind</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stayora-sand/80 max-w-2xl mx-auto font-light leading-relaxed">
            Thoughtfully designed stays. Exceptional experiences. Unforgettable moments.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/rooms"
              className="btn-gold px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-luxury w-full sm:w-auto justify-center"
            >
              <span>Explore Rooms & Suites</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="btn-navy px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Discover Stayora</span>
            </Link>
          </div>
        </div>

        {/* Polished Floating Booking Search Bar */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
          <BookingSearchBar />
        </div>
      </section>

      {/* 2. FEATURED ROOMS & SUITES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
              Bespoke Sanctuaries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy mt-1">
              Featured Rooms & Suites
            </h2>
            <p className="text-stayora-charcoal/70 text-sm mt-2 max-w-lg">
              Each accommodation is crafted with natural timber, hand-dressed stone, panoramic terraces, and dedicated butler attention.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 text-stayora-navy hover:text-stayora-gold-dark text-xs uppercase tracking-widest font-semibold transition-colors group"
            >
              <span>View All 6 Accommodations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-96 rounded-lg bg-stayora-sand/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBookNow={() => onOpenBooking(room)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 p-3 rounded bg-stayora-sand-light border border-stayora-gold/20 text-center text-xs text-stayora-charcoal/60">
          * All tariffs are demonstration rates displayed in INR. Breakfast and afternoon tea are included with every suite.
        </div>
      </section>

      {/* 3. EXPERIENCES SECTION (Editorial Layouts) */}
      <section className="bg-stayora-navy text-stayora-sand-light py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
              The Stayora Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stayora-sand-light mt-2">
              Curated Escapes & Terroir
            </h2>
            <p className="text-stayora-sand/70 text-sm sm:text-base mt-4 font-light">
              Beyond luxury lodging lies a transformative world of holistic healing, gastronomic artistry, and pure immersion in nature.
            </p>
          </div>

          <div className="space-y-20">
            {experiences.map((exp, idx) => (
              <div
                key={exp.title}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative rounded-lg overflow-hidden border border-stayora-gold/20 shadow-luxury group">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      loading="lazy"
                      className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-stayora-navy/80 backdrop-blur-md text-stayora-gold text-xs font-semibold uppercase tracking-wider border border-stayora-gold/30">
                        {exp.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Content */}
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-1' : ''} space-y-4`}>
                  <div className="flex items-center gap-2 text-stayora-gold text-xs uppercase tracking-widest font-semibold">
                    {exp.icon}
                    <span>{exp.category}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl text-stayora-sand-light leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-stayora-sand/70 text-sm sm:text-base leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/experiences"
                      className="inline-flex items-center gap-2 text-stayora-gold hover:text-white text-xs uppercase tracking-widest font-semibold border-b border-stayora-gold/40 hover:border-stayora-gold pb-1 transition-all"
                    >
                      <span>Explore Experience Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY STAYORA (The Four Pillars) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            Our Hospitality Ethos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy mt-1">
            Why Choose Stayora?
          </h2>
          <p className="text-stayora-charcoal/70 text-sm mt-3">
            Built on a philosophy of reverence for our guests and harmony with the mountain sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-lg bg-stayora-sand-light border border-stayora-gold/20 shadow-subtle hover:border-stayora-gold/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-stayora-navy flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-stayora-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-stayora-charcoal/70 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE GALLERY */}
      <section className="bg-stayora-navy-deep text-stayora-sand-light py-24 px-4 sm:px-6 lg:px-8 border-y border-stayora-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
                Visual Sanctuary
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stayora-sand-light mt-1">
                The Stayora Gallery
              </h2>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {['All', 'Rooms', 'Dining', 'Wellness', 'Grounds', 'Architecture'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryCat(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                    activeGalleryCat === cat
                      ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                      : 'bg-stayora-navy text-stayora-sand/70 hover:text-stayora-gold border border-stayora-gold/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative h-72 rounded-lg overflow-hidden bg-stayora-navy cursor-pointer border border-stayora-gold/15 shadow-luxury"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy via-stayora-navy/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-base text-stayora-sand-light group-hover:text-stayora-gold transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-stayora-sand/70 line-clamp-1 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 btn-gold px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold"
            >
              <span>Explore Complete Photo Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredGallery}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
      />

      {/* 6. OFFERS & PACKAGES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            Seasonal Privileges
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy mt-1">
            Offers & Curated Packages
          </h2>
          <p className="text-stayora-charcoal/70 text-sm mt-3">
            Distinctive experiences designed around intimate milestones, extended mountain retreats, and harvest seasons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-stayora-gold/20 rounded-lg overflow-hidden shadow-subtle hover:border-stayora-gold/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded bg-stayora-navy/85 backdrop-blur-sm text-stayora-gold font-mono text-xs font-semibold border border-stayora-gold/30">
                    Promo: {offer.promo_code}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stayora-gold-dark mb-1">
                    {offer.discount_label}
                  </div>
                  <h3 className="font-serif text-xl text-stayora-navy mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stayora-charcoal/70 leading-relaxed mb-4">
                    {offer.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stayora-sand-dark/20 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-stayora-charcoal/50 italic">
                  {offer.validity_info}
                </span>
                <button
                  onClick={() => onOpenBooking()}
                  className="text-xs font-semibold uppercase tracking-wider text-stayora-navy hover:text-stayora-gold-dark flex items-center gap-1"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GUEST TESTIMONIALS (Clearly Treated as Demo Content) */}
      <section className="bg-stayora-navy text-stayora-sand-light py-24 px-4 sm:px-6 lg:px-8 border-t border-stayora-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
              Guest Impressions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stayora-sand-light mt-1">
              Words From Our Visitors
            </h2>
            <div className="inline-block mt-2 px-3 py-0.5 rounded bg-stayora-gold/10 text-stayora-gold text-[11px] font-mono border border-stayora-gold/20">
              * Fictional demonstration feedback for portfolio showcase
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-stayora-navy-light/60 border border-stayora-gold/25 rounded-lg p-7 flex flex-col justify-between relative shadow-luxury"
              >
                <div>
                  <Quote className="w-8 h-8 text-stayora-gold/40 mb-4" />
                  <p className="text-stayora-sand/90 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stayora-gold/15">
                  <div className="font-serif text-base text-stayora-sand-light font-semibold">
                    {t.author}
                  </div>
                  <div className="text-xs text-stayora-gold mt-0.5">
                    {t.location}
                  </div>
                  <div className="text-[11px] text-stayora-sand/50 mt-1">
                    {t.stayed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION (Clearly Identified Fictional Demo Location) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
              The Sanctuary Coordinates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy">
              Secluded in the Coorg Highlands
            </h2>
            <p className="text-stayora-charcoal/70 text-sm leading-relaxed">
              Situated on a private 140-acre ridge along the Western Ghats escarpment. STAYORA offers total seclusion while remaining comfortably accessible by chauffeured car or private helicopter charter.
            </p>

            <div className="p-4 rounded bg-stayora-sand-light border border-stayora-gold/25 text-xs text-stayora-charcoal/80 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stayora-gold-dark flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Location:</strong> {settings.address_line1}, {settings.address_line2}, {settings.city}, {settings.state} {settings.postal_code}, {settings.country}
                </span>
              </div>
              <p className="text-[11px] text-stayora-charcoal/60 italic pl-6">
                * Fictional demonstration address. Coordinates used for client presentation only.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-stayora-charcoal/80">
              <div className="flex justify-between py-2 border-b border-stayora-sand-dark/30">
                <span className="font-semibold">Kempegowda Intl. Airport (BLR):</span>
                <span>240 km / 4.5 hrs chauffeured drive (or 45 min helicopter transfer)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stayora-sand-dark/30">
                <span className="font-semibold">Mangalore Intl. Airport (IXE):</span>
                <span>135 km / 3 hrs chauffeured drive</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Kannur Intl. Airport (CNN):</span>
                <span>85 km / 2 hrs scenic hill drive</span>
              </div>
            </div>

            <div>
              <Link
                to="/contact"
                className="btn-gold px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
              >
                <span>Inquire With Concierge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Map Preview Graphic */}
          <div className="lg:col-span-7">
            <div className="relative rounded-lg overflow-hidden border border-stayora-gold/30 shadow-luxury bg-stayora-navy text-stayora-sand-light p-8 sm:p-12 min-h-[380px] flex flex-col justify-between">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                  alt="Mountain Topography Map"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-stayora-gold/20 text-stayora-gold text-xs font-semibold mb-4">
                  <MapPin className="w-3.5 h-3.5" /> High Altitude Sanctuary Escarpment
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light">
                  {settings.city} Escarpment, {settings.state}
                </h3>
                <p className="text-xs text-stayora-sand/70 mt-2 max-w-md">
                  Elevation: 1,420 meters above sea level. Temperate subtropical highland climate year-round with fresh mountain air and drifting mist.
                </p>
              </div>

              <div className="relative z-10 pt-8 flex flex-wrap gap-4 text-xs">
                <div className="px-4 py-2 rounded bg-stayora-navy-light/90 border border-stayora-gold/30">
                  <span className="text-stayora-gold block font-semibold">Private Helipad</span>
                  <span className="text-stayora-sand/70 text-[11px]">Direct Touchdown On-Estate</span>
                </div>
                <div className="px-4 py-2 rounded bg-stayora-navy-light/90 border border-stayora-gold/30">
                  <span className="text-stayora-gold block font-semibold">Estate Chauffeur</span>
                  <span className="text-stayora-sand/70 text-[11px]">Mercedes-Benz GLS Transfers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="bg-stayora-navy text-stayora-sand-light py-20 px-4 sm:px-6 lg:px-8 border-t border-stayora-gold/20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Begin Your Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-stayora-sand-light">
            Your Escape. Elevated.
          </h2>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-xl mx-auto font-light">
            Contact our reservations desk to design an unforgettable bespoke mountain holiday tailored to every whim.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="btn-gold px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-luxury w-full sm:w-auto justify-center"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Stay</span>
            </button>
            <Link
              to="/contact"
              className="btn-navy px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Contact Concierge Desk</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
