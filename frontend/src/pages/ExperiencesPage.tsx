import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Waves, Flower2, TreePine, Sparkles, ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ExperiencesPageProps {
  onOpenBooking: () => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onOpenBooking }) => {
  const { getWhatsAppUrl } = useSettings();

  const sections = [
    {
      id: 'dining',
      title: 'Aura Fine Dining & The Cellar',
      subtitle: 'Harvested from the Forest. Elevated by Master Artisans.',
      icon: <Utensils className="w-5 h-5 text-stayora-gold" />,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=85',
      lead: 'An ode to indigenous biodiversity and centuries of coastal and highland culinary history. Led by Executive Chef Aarav, every creation at Aura is shaped by what the estate soil and wild forest orchards yield daily.',
      features: [
        'Chef’s 8-course evening degustation paired with private estate cellar reserves.',
        'Wild spice forage and interactive culinary pavilion with resident masters.',
        'Private candlelit dinner set within an ancient coffee glade.',
        'Daily organic sourdough, stone-ground flours, and single-estate Arabica roast.'
      ]
    },
    {
      id: 'wellness',
      title: 'Soma Spa & Ayurvedic Sanctuary',
      subtitle: 'Restorative Harmony for Mind, Body, and Breath.',
      icon: <Flower2 className="w-5 h-5 text-stayora-gold" />,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
      lead: 'Anchored in the classical 5,000-year-old healing traditions of Ayurveda, Soma Sanctuary offers deeply personalized restorative pathways formulated by Vaidyas (Ayurvedic physicians).',
      features: [
        'Warm herbal oil Abhyanga massage using estate-infused botanical extracts.',
        'Shirodhara third-eye oil flow for nervous system tranquility and deep sleep.',
        'Dawn Pranayama breathing and Hatha yoga at the cantilevered bamboo shala.',
        'Hydrotherapy herbal baths infused with fresh mountain lemongrass and vetiver.'
      ]
    },
    {
      id: 'pool',
      title: 'The Escarpment Horizon Pool',
      subtitle: 'Heated Geothermal Waters Floating Above The Valley of Mist.',
      icon: <Waves className="w-5 h-5 text-stayora-gold" />,
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
      lead: 'Engineered seamlessly along the ridge contour, our 30-meter heated infinity horizon pool provides the sensation of gliding straight into the cloud canopy.',
      features: [
        'Maintained at an indulgent 28°C throughout all four seasons.',
        'Sunken pool loungers and heated stone thermal benches.',
        'Poolside elixir bar serving cold-pressed botanicals and organic mocktails.',
        'Silent morning hours reserved for meditative swimming and floating.'
      ]
    },
    {
      id: 'nature',
      title: 'Private Biosphere Trails & Excursions',
      subtitle: '140 Acres of Ancient Woods, Streams, and Canopy Heights.',
      icon: <TreePine className="w-5 h-5 text-stayora-gold" />,
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85',
      lead: 'The STAYORA estate is an eco-sanctuary protecting old-growth timber and native fauna. Our naturalists lead intimate expeditions into the heart of the Western Ghats.',
      features: [
        'Guided sunrise birdsong walks to spot rare Malabar pied hornbills and emerald doves.',
        'Trek to the secluded Hidden Brook Waterfall with a gourmet picnic basket.',
        'Night forest acoustics walk and astronomical stargazing through our high-powered telescope.',
        'Heritage coffee cultivation workshop from blossom to pour-over cup.'
      ]
    }
  ];

  return (
    <div className="bg-stayora-ivory min-h-screen pt-28 pb-24 text-stayora-charcoal">
      
      {/* Header Banner */}
      <div className="bg-stayora-navy text-stayora-sand-light py-20 px-4 sm:px-6 lg:px-8 border-b border-stayora-gold/20 mb-16">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Bespoke Sanctuary Life
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stayora-sand-light">
            Elevated Experiences
          </h1>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Every moment at STAYORA is thoughtfully composed to rekindle wonder, wellness, and deep human connection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            id={sec.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image Box */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-lg overflow-hidden border border-stayora-gold/30 shadow-luxury group">
                <img
                  src={sec.image}
                  alt={sec.title}
                  className="w-full h-[440px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 p-2 rounded-full bg-stayora-navy/80 border border-stayora-gold/30 backdrop-blur-sm">
                  {sec.icon}
                </div>
              </div>
            </div>

            {/* Content Box */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : ''} space-y-6`}>
              <div>
                <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.2em] font-semibold block mb-1">
                  {sec.subtitle}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy">
                  {sec.title}
                </h2>
              </div>

              <p className="text-stayora-charcoal/80 text-sm sm:text-base leading-relaxed font-light">
                {sec.lead}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stayora-navy">
                  Experience Highlights
                </h4>
                <div className="space-y-2">
                  {sec.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs text-stayora-charcoal/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-stayora-gold-dark mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={onOpenBooking}
                  className="btn-gold px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve an Experience Stay</span>
                </button>
                <a
                  href={getWhatsAppUrl(sec.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-navy px-6 py-3 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-stayora-gold" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
