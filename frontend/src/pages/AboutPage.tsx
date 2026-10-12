import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Leaf, Compass, Award, ArrowRight, HeartHandshake } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  const values = [
    {
      title: 'Architectural Reverence',
      desc: 'Constructed strictly following the natural topography contours without altering the mountain gradient. Every building integrates dressed local riverstone, unlacquered brass, and reclaimed architectural timber.',
      icon: <Compass className="w-5 h-5 text-stayora-gold" />,
    },
    {
      title: 'Regenerative Sustainability',
      desc: '100% of our energy is supplemented by solar micro-grids and geothermal warmth. Zero single-use plastics are permitted on the estate, and 140 acres remain designated as a permanent biosphere reserve.',
      icon: <Leaf className="w-5 h-5 text-stayora-gold" />,
    },
    {
      title: 'Terroir & Community',
      desc: 'Over 85% of our hospitality team is recruited from indigenous regional farming families, trained in world-class luxury standards while retaining authentic cultural hospitality.',
      icon: <HeartHandshake className="w-5 h-5 text-stayora-gold" />,
    },
    {
      title: 'Uncompromised Privacy',
      desc: 'With only six signature residential pavilions spaced generously across 140 acres of private ridge, guest sanctuary and silence remain paramount.',
      icon: <ShieldCheck className="w-5 h-5 text-stayora-gold" />,
    },
  ];

  return (
    <div className="bg-stayora-ivory min-h-screen pt-28 pb-24 text-stayora-charcoal">
      
      {/* Hero Banner */}
      <div className="bg-stayora-navy text-stayora-sand-light py-20 px-4 sm:px-6 lg:px-8 border-b border-stayora-gold/20 mb-16">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Our Heritage & Ethos
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stayora-sand-light">
            The Philosophy of Stayora
          </h1>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Founded on the belief that true luxury is not excess, but stillness, intention, and profound harmony with the earth.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.2em] font-semibold">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stayora-navy">
              Conceived as an Antidote to Modern Velocity
            </h2>
            <div className="text-stayora-charcoal/80 text-sm sm:text-base space-y-4 leading-relaxed font-light">
              <p>
                In an era dominated by relentless urgency and sensory saturation, {settings.site_name} was envisioned as an architectural refuge—a sanctuary where time slows to the cadence of mountain mist and wind whispering through pine needles.
              </p>
              <p>
                Perched high on a ridge in the Coorg escarpment, the sanctuary was built over seven years of patient craftsmanship. Rather than razing old-growth teak and rosewood trees, our architects contoured pavilions around living canopies, incorporating natural boulders into subterranean wine cellars and sunken soaking baths.
              </p>
              <p>
                Here, hospitality is not scripted formality; it is heartfelt Indian warmth elevated into an art form.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-stayora-gold/30 shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                alt="Architecture & Mountain Mist"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stayora-navy/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-stayora-sand-light">
                <blockquote className="font-serif italic text-base sm:text-lg">
                  "We did not build on the mountain; we allowed the mountain to dictate every beam, terrace, and stone."
                </blockquote>
                <span className="text-xs text-stayora-gold mt-2 block font-sans uppercase tracking-wider">
                  — The Architectural Founding Collective
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="bg-white rounded-lg border border-stayora-gold/20 p-8 sm:p-12 shadow-subtle">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.2em] font-semibold">
              Principles We Guard
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stayora-navy mt-1">
              The Four Cornerstones
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val) => (
              <div key={val.title} className="flex gap-4 p-5 rounded bg-stayora-sand-light/50 border border-stayora-gold/15">
                <div className="w-10 h-10 rounded-full bg-stayora-navy flex items-center justify-center flex-shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h4 className="font-serif text-lg text-stayora-navy font-semibold mb-1">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stayora-charcoal/70 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-stayora-navy text-stayora-sand-light rounded-lg p-10 sm:p-14 text-center border border-stayora-gold/30 shadow-luxury space-y-5">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Experience the Sanctuary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stayora-sand-light">
            Plan Your Journey with Our Concierge
          </h2>
          <p className="text-stayora-sand/70 text-sm max-w-lg mx-auto">
            Whether for an intimate anniversary, a restorative solitary retreat, or a family milestone, our team awaits your inquiry.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/rooms" className="btn-gold px-8 py-3 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
              <span>View Residences</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-navy px-8 py-3 rounded-sm text-xs uppercase tracking-widest font-medium">
              <span>Contact Concierge Desk</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
