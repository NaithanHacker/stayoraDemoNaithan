import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, ShieldAlert, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import { ContactInquiry } from '../types';

export const ContactPage: React.FC = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload: ContactInquiry = {
        name,
        email,
        phone,
        subject,
        message,
      };
      await api.createContactInquiry(payload);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = getWhatsAppUrl();

  return (
    <div className="bg-stayora-ivory min-h-screen pt-28 pb-24 text-stayora-charcoal">
      
      {/* Header Banner */}
      <div className="bg-stayora-navy text-stayora-sand-light py-20 px-4 sm:px-6 lg:px-8 border-b border-stayora-gold/20 mb-16">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-stayora-gold text-xs uppercase tracking-[0.25em] font-semibold">
            Concierge Liaison
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stayora-sand-light">
            Contact the Sanctuary
          </h1>
          <p className="text-stayora-sand/70 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Our private concierge team is at your disposal to arrange travel logistics, dietary accommodations, and bespoke itineraries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Sanctuary Details & Direct CTAs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.2em] font-semibold">
                Direct Inquiries
              </span>
              <h2 className="font-serif text-3xl text-stayora-navy">
                We Await Your Signal
              </h2>
              <p className="text-stayora-charcoal/70 text-sm leading-relaxed">
                Whether seeking availability, buyout arrangements, or helicopter charter coordination, our team guarantees a response within 4 hours.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-white border border-stayora-gold/20 shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stayora-sand-light flex items-center justify-center text-stayora-gold-dark flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 font-semibold block">
                    Concierge Direct Telephone
                  </span>
                  <a href={`tel:${settings.contact_phone}`} className="font-serif text-lg font-semibold text-stayora-navy hover:text-stayora-gold-dark transition-colors">
                    {settings.contact_phone}
                  </a>
                  <p className="text-[11px] text-stayora-charcoal/60 mt-0.5">Available 24 hours daily</p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-white border border-stayora-gold/20 shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stayora-sand-light flex items-center justify-center text-stayora-gold-dark flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 font-semibold block">
                    Electronic Mail
                  </span>
                  <a href={`mailto:${settings.contact_email}`} className="font-serif text-lg font-semibold text-stayora-navy hover:text-stayora-gold-dark transition-colors">
                    {settings.contact_email}
                  </a>
                  <p className="text-[11px] text-stayora-charcoal/60 mt-0.5">Formal and corporate buyout inquiries</p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-white border border-stayora-gold/20 shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stayora-sand-light flex items-center justify-center text-stayora-gold-dark flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stayora-charcoal/60 font-semibold block">
                    Sanctuary Coordinates
                  </span>
                  <p className="font-serif text-base text-stayora-navy font-semibold">
                    {settings.address_line1}, {settings.address_line2}
                  </p>
                  <p className="text-xs text-stayora-charcoal/70">
                    {settings.city}, {settings.state} {settings.postal_code}, {settings.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp CTA Card */}
            <div className="p-6 rounded-lg bg-stayora-navy text-stayora-sand-light border border-stayora-gold/30 shadow-luxury space-y-3">
              <div className="flex items-center gap-2 text-stayora-gold text-xs uppercase tracking-wider font-semibold">
                <MessageSquare className="w-4 h-4" /> Instant Messaging Concierge
              </div>
              <h3 className="font-serif text-xl text-stayora-sand-light">
                Prefer WhatsApp for Instant Inquiries?
              </h3>
              <p className="text-xs text-stayora-sand/70 leading-relaxed font-light">
                Connect directly with our head of reservations on WhatsApp for swift answers regarding room rates, transfers, and private dining.
              </p>
              <div className="pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold py-2.5 px-5 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Conversation</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-stayora-gold/20 shadow-luxury p-8 sm:p-10 space-y-6">
              <div>
                <span className="text-stayora-gold-dark text-xs uppercase tracking-[0.2em] font-semibold block mb-1">
                  Private Correspondence
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-stayora-navy">
                  Send a Message to the Concierge
                </h3>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded bg-stayora-sand-light border border-stayora-gold/40 text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-stayora-gold-dark mx-auto" />
                  <h4 className="font-serif text-xl text-stayora-navy">Inquiry Received</h4>
                  <p className="text-xs text-stayora-charcoal/80 max-w-md mx-auto">
                    Thank you. Your message has been logged in our reservations desk. A personal concierge officer will respond shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-navy px-5 py-2 rounded text-xs uppercase tracking-wider font-medium mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-stayora-charcoal/80">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Lorde Alistair"
                        className="w-full bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-3.5 py-2.5 text-sm text-stayora-charcoal focus:outline-none focus:border-stayora-gold-dark"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-stayora-charcoal/80">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alistair@domain.com"
                        className="w-full bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-3.5 py-2.5 text-sm text-stayora-charcoal focus:outline-none focus:border-stayora-gold-dark"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-stayora-charcoal/80">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-3.5 py-2.5 text-sm text-stayora-charcoal focus:outline-none focus:border-stayora-gold-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-stayora-charcoal/80">
                        Subject of Inquiry *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Helicopter Transfer & Suite Booking"
                        className="w-full bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-3.5 py-2.5 text-sm text-stayora-charcoal focus:outline-none focus:border-stayora-gold-dark"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-stayora-charcoal/80">
                      Message Details *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share your dates of interest, party size, and any bespoke requirements..."
                      className="w-full bg-stayora-sand-light border border-stayora-sand-dark/40 rounded px-3.5 py-2.5 text-sm text-stayora-charcoal focus:outline-none focus:border-stayora-gold-dark resize-none"
                      required
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold py-3.5 px-6 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Message...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}

              {/* Demo note */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-stayora-charcoal/50 border-t border-stayora-sand-dark/30">
                <ShieldAlert className="w-3.5 h-3.5 text-stayora-gold-dark flex-shrink-0" />
                <span>Inquiries submitted here are stored directly in the STAYORA backend for staff dashboard demonstration.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
