import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, LayoutDashboard, BedDouble, CalendarCheck, MessageSquare,
  Settings, LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertCircle,
  Search, Filter, Eye, ArrowUpRight, Save, X, Phone, Mail, MapPin, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import {
  Room, BookingInquiry, ContactInquiry, AdminMetrics, RoomCategory, Amenity
} from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings, formatPrice, updateSettings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'messages' | 'settings'>('overview');

  // State data
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [bookings, setBookings] = useState<BookingInquiry[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [messages, setMessages] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Bookings filter & search
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingInquiry | null>(null);

  // Room modal state (Add / Edit)
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({
    title: '',
    slug: '',
    category: 1,
    short_description: '',
    full_description: '',
    price_per_night: '20000',
    capacity: 2,
    size_sqft: 750,
    bed_type: 'King Bed',
    view: 'Valley Mist View',
    primary_image: '',
    is_featured: false,
    is_available: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Load all initial data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [mRes, bRes, rRes, cRes, aRes, msgRes] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getBookings(),
        api.getRooms(),
        api.getCategories(),
        api.getAmenities(),
        api.getContactInquiries(),
      ]);
      setMetrics(mRes);
      setBookings(bRes);
      setRooms(rRes);
      setCategories(cRes);
      setAmenities(aRes);
      setMessages(msgRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Status badge helper
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">Confirmed</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-800">Contacted</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">Pending Review</span>;
    }
  };

  // Update booking status
  const handleUpdateBookingStatus = async (id: number, newStatus: any, notes?: string) => {
    try {
      const updated = await api.updateBooking(id, {
        status: newStatus,
        ...(notes !== undefined ? { staff_notes: notes } : {}),
      });
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(updated);
      }
      // Refresh metrics
      api.getAdminMetrics().then(m => setMetrics(m)).catch(() => {});
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  // Open Room Modal for Create or Edit
  const openRoomModal = (roomToEdit?: Room) => {
    if (roomToEdit) {
      setEditingRoom(roomToEdit);
      setRoomForm({
        title: roomToEdit.title,
        slug: roomToEdit.slug,
        category: roomToEdit.category,
        short_description: roomToEdit.short_description,
        full_description: roomToEdit.full_description || '',
        price_per_night: String(roomToEdit.price_per_night),
        capacity: roomToEdit.capacity,
        size_sqft: roomToEdit.size_sqft,
        bed_type: roomToEdit.bed_type,
        view: roomToEdit.view,
        primary_image: roomToEdit.primary_image,
        is_featured: roomToEdit.is_featured,
        is_available: roomToEdit.is_available,
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        title: '',
        slug: '',
        category: categories.length > 0 ? categories[0].id : 1,
        short_description: '',
        full_description: '',
        price_per_night: '24000',
        capacity: 2,
        size_sqft: 800,
        bed_type: 'King Bed',
        view: 'Valley Escarpment View',
        primary_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
        is_featured: false,
        is_available: true,
      });
    }
    setRoomModalOpen(true);
  };

  // Save room form
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...roomForm,
        price_per_night: parseFloat(roomForm.price_per_night),
      };

      if (!payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (editingRoom) {
        await api.updateRoom(editingRoom.slug, payload);
      } else {
        await api.createRoom(payload);
      }

      setRoomModalOpen(false);
      // Reload rooms
      const updatedRooms = await api.getRooms();
      setRooms(updatedRooms);
    } catch (err: any) {
      alert(`Room operation failed: ${err.message}`);
    }
  };

  // Delete room
  const handleDeleteRoom = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the accommodation "${title}"?`)) return;
    try {
      await api.deleteRoom(slug);
      setRooms(prev => prev.filter(r => r.slug !== slug));
    } catch (err: any) {
      alert(`Could not delete room: ${err.message}`);
    }
  };

  // Save hotel branding settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveMsg('');
    try {
      await updateSettings(settingsForm);
      setSettingsSaveMsg('Hotel settings successfully saved and applied globally.');
      setTimeout(() => setSettingsSaveMsg(''), 4000);
    } catch (err: any) {
      alert(`Could not save settings: ${err.message}`);
    }
  };

  // Mark message resolved
  const handleResolveMessage = async (id: number) => {
    try {
      const updated = await api.resolveContactInquiry(id);
      setMessages(prev => prev.map(m => m.id === id ? updated : m));
    } catch (err: any) {
      alert(`Could not update message: ${err.message}`);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter !== 'ALL' && b.status !== bookingStatusFilter) return false;
    if (bookingSearch) {
      const term = bookingSearch.toLowerCase();
      const matchName = b.guest_name.toLowerCase().includes(term);
      const matchEmail = b.guest_email.toLowerCase().includes(term);
      const matchRoom = (b.room_name_snapshot || '').toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchRoom) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stayora-navy text-stayora-sand-light flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-stayora-navy-deep border-b border-stayora-gold/20 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-stayora-gold/50 flex items-center justify-center bg-stayora-navy">
              <span className="font-serif text-stayora-gold font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider text-stayora-sand-light font-semibold uppercase block leading-none">
                {settings.site_name}
              </span>
              <span className="text-[9px] tracking-widest text-stayora-gold uppercase font-light">
                Staff Administration
              </span>
            </div>
          </Link>

          <span className="hidden md:inline text-stayora-sand/30">|</span>
          <span className="hidden md:inline text-xs text-stayora-sand/60">
            Welcome, <strong className="text-stayora-gold">{user?.username}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-stayora-sand/80 hover:text-stayora-gold flex items-center gap-1 px-3 py-1.5 rounded border border-stayora-gold/20 hover:border-stayora-gold transition-colors"
          >
            <span>View Public Website</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="p-1.5 rounded text-stayora-sand/60 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-stayora-navy-deep/60 border-r border-stayora-gold/15 p-4 flex md:flex-col justify-between overflow-x-auto">
          <nav className="flex md:flex-col gap-1.5 w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors w-full text-left whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                  : 'text-stayora-sand/80 hover:bg-stayora-navy-light hover:text-stayora-gold'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors w-full text-left whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                  : 'text-stayora-sand/80 hover:bg-stayora-navy-light hover:text-stayora-gold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Booking Inquiries</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stayora-navy text-stayora-gold font-mono">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors w-full text-left whitespace-nowrap ${
                activeTab === 'rooms'
                  ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                  : 'text-stayora-sand/80 hover:bg-stayora-navy-light hover:text-stayora-gold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BedDouble className="w-4 h-4" />
                <span>Accommodations</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stayora-navy text-stayora-gold font-mono">
                {rooms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors w-full text-left whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                  : 'text-stayora-sand/80 hover:bg-stayora-navy-light hover:text-stayora-gold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Guest Messages</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stayora-navy text-stayora-gold font-mono">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors w-full text-left whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-stayora-gold text-stayora-navy font-semibold shadow-gold-glow'
                  : 'text-stayora-sand/80 hover:bg-stayora-navy-light hover:text-stayora-gold'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Hotel Branding</span>
            </button>
          </nav>

          <div className="hidden md:block mt-8 p-3 rounded bg-stayora-navy-deep/90 border border-stayora-gold/15 text-[11px] text-stayora-sand/60">
            <p className="font-semibold text-stayora-gold mb-1">Portfolio Mode</p>
            <p>All administrative actions reflect live in the Django backend database.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                  Management Overview
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-0.5">
                  Performance & Inquiries
                </h1>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-stayora-navy-deep p-5 rounded-lg border border-stayora-gold/25 shadow-luxury">
                  <span className="text-[11px] uppercase tracking-wider text-stayora-sand/70 block">
                    Total Inquiries
                  </span>
                  <div className="font-serif text-3xl font-bold text-stayora-sand-light mt-1">
                    {metrics ? metrics.inquiries.total : bookings.length}
                  </div>
                  <span className="text-[11px] text-stayora-gold mt-1 block">
                    {metrics?.inquiries.pending || 1} pending staff review
                  </span>
                </div>

                <div className="bg-stayora-navy-deep p-5 rounded-lg border border-stayora-gold/25 shadow-luxury">
                  <span className="text-[11px] uppercase tracking-wider text-stayora-sand/70 block">
                    Confirmed Reservations
                  </span>
                  <div className="font-serif text-3xl font-bold text-emerald-400 mt-1">
                    {metrics ? metrics.inquiries.confirmed : bookings.filter(b => b.status === 'CONFIRMED').length}
                  </div>
                  <span className="text-[11px] text-stayora-sand/60 mt-1 block">
                    Verified guest bookings
                  </span>
                </div>

                <div className="bg-stayora-navy-deep p-5 rounded-lg border border-stayora-gold/25 shadow-luxury">
                  <span className="text-[11px] uppercase tracking-wider text-stayora-sand/70 block">
                    Pipeline Tariff Value
                  </span>
                  <div className="font-serif text-3xl font-bold text-stayora-gold mt-1">
                    {formatPrice(metrics?.revenue.total_pipeline || 165000)}
                  </div>
                  <span className="text-[11px] text-stayora-sand/60 mt-1 block">
                    Estimated gross demo pipeline
                  </span>
                </div>

                <div className="bg-stayora-navy-deep p-5 rounded-lg border border-stayora-gold/25 shadow-luxury">
                  <span className="text-[11px] uppercase tracking-wider text-stayora-sand/70 block">
                    Active Suites & Villas
                  </span>
                  <div className="font-serif text-3xl font-bold text-stayora-sand-light mt-1">
                    {rooms.length}
                  </div>
                  <span className="text-[11px] text-stayora-sand/60 mt-1 block">
                    Catalog residences in database
                  </span>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-stayora-navy-deep rounded-lg border border-stayora-gold/20 shadow-luxury overflow-hidden">
                <div className="px-6 py-4 border-b border-stayora-gold/15 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-stayora-sand-light">
                    Recent Booking Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-stayora-gold hover:underline"
                  >
                    View All Inquiries →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stayora-navy-surface text-stayora-sand/70 uppercase tracking-wider border-b border-stayora-gold/10">
                      <tr>
                        <th className="px-6 py-3">Guest Name</th>
                        <th className="px-6 py-3">Suite Requested</th>
                        <th className="px-6 py-3">Dates</th>
                        <th className="px-6 py-3">Tariff</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stayora-gold/10 text-stayora-sand/90">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-stayora-navy-light/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-stayora-sand-light">
                            {b.guest_name}
                            <span className="block text-[11px] text-stayora-sand/50 font-normal">{b.guest_email}</span>
                          </td>
                          <td className="px-6 py-4">{b.room_name_snapshot || 'Suite Inquiry'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {b.check_in} to {b.check_out} ({b.total_nights || 1} nights)
                          </td>
                          <td className="px-6 py-4 font-semibold text-stayora-gold">
                            {formatPrice(b.estimated_total || 0)}
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setActiveTab('bookings');
                              }}
                              className="text-xs text-stayora-gold hover:underline font-medium"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKING INQUIRIES */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                    Reservations Management
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-0.5">
                    Guest Booking Inquiries
                  </h1>
                </div>

                {/* Filter and search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stayora-sand/50" />
                    <input
                      type="text"
                      placeholder="Search guest or suite..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="bg-stayora-navy-deep border border-stayora-gold/25 rounded pl-8 pr-3 py-1.5 text-xs text-stayora-sand-light focus:outline-none focus:border-stayora-gold"
                    />
                  </div>

                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="bg-stayora-navy-deep border border-stayora-gold/25 rounded px-3 py-1.5 text-xs text-stayora-sand-light focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="CONTACTED">Contacted Guest</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-stayora-navy-deep rounded-lg border border-stayora-gold/20 shadow-luxury overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stayora-navy-surface text-stayora-sand/70 uppercase tracking-wider border-b border-stayora-gold/10">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Guest Details</th>
                        <th className="px-6 py-3">Suite Requested</th>
                        <th className="px-6 py-3">Check-In / Out</th>
                        <th className="px-6 py-3">Guests</th>
                        <th className="px-6 py-3">Tariff</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stayora-gold/10 text-stayora-sand/90">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-stayora-sand/50 italic">
                            No booking inquiries match the current search or status filter.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-stayora-navy-light/40 transition-colors">
                            <td className="px-6 py-4 font-mono text-stayora-gold">#STAY-{b.id}</td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-stayora-sand-light block">{b.guest_name}</span>
                              <span className="text-[11px] text-stayora-sand/60 block">{b.guest_email}</span>
                              <span className="text-[11px] text-stayora-sand/60 block">{b.guest_phone}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-stayora-sand-light">
                              {b.room_name_snapshot || 'Suite Selected'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>{b.check_in}</div>
                              <div className="text-stayora-sand/50">to {b.check_out} ({b.total_nights || 1} nights)</div>
                            </td>
                            <td className="px-6 py-4">{b.num_guests} guests</td>
                            <td className="px-6 py-4 font-serif text-stayora-gold font-semibold">
                              {formatPrice(b.estimated_total || 0)}
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="px-3 py-1 rounded bg-stayora-navy border border-stayora-gold/30 hover:border-stayora-gold text-stayora-sand hover:text-stayora-gold text-xs transition-colors"
                              >
                                View & Update
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inquiry Detail & Status Update Drawer / Modal */}
              {selectedBooking && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-stayora-navy-deep border border-stayora-gold/40 rounded-lg max-w-xl w-full p-6 text-stayora-sand-light space-y-5 shadow-2xl relative">
                    <div className="flex items-center justify-between pb-3 border-b border-stayora-gold/15">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stayora-gold font-semibold block">
                          Inquiry Detail #STAY-{selectedBooking.id}
                        </span>
                        <h3 className="font-serif text-xl text-stayora-sand-light">
                          {selectedBooking.guest_name}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="p-1 rounded text-stayora-sand/60 hover:text-stayora-sand"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stayora-sand/50 block">Email:</span>
                        <span className="font-medium">{selectedBooking.guest_email}</span>
                      </div>
                      <div>
                        <span className="text-stayora-sand/50 block">Phone:</span>
                        <span className="font-medium">{selectedBooking.guest_phone}</span>
                      </div>
                      <div>
                        <span className="text-stayora-sand/50 block">Dates:</span>
                        <span>{selectedBooking.check_in} to {selectedBooking.check_out} ({selectedBooking.total_nights || 1} nights)</span>
                      </div>
                      <div>
                        <span className="text-stayora-sand/50 block">Estimated Tariff:</span>
                        <span className="font-serif text-stayora-gold font-semibold text-sm">{formatPrice(selectedBooking.estimated_total || 0)}</span>
                      </div>
                    </div>

                    {selectedBooking.special_requests && (
                      <div className="p-3 rounded bg-stayora-navy text-xs space-y-1 border border-stayora-gold/10">
                        <span className="text-stayora-gold font-semibold block">Guest Special Requests:</span>
                        <p className="text-stayora-sand/80">{selectedBooking.special_requests}</p>
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    <div className="space-y-2 pt-2 border-t border-stayora-gold/15">
                      <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold block">
                        Update Inquiry Status:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateBookingStatus(selectedBooking.id!, st)}
                            className={`py-2 px-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-all ${
                              selectedBooking.status === st
                                ? 'bg-stayora-gold text-stayora-navy shadow-gold-glow'
                                : 'bg-stayora-navy text-stayora-sand/70 hover:text-stayora-gold border border-stayora-gold/20'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Staff Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-stayora-sand/70 font-semibold block">
                        Internal Staff Notes:
                      </label>
                      <textarea
                        rows={2}
                        defaultValue={selectedBooking.staff_notes || ''}
                        onBlur={(e) => handleUpdateBookingStatus(selectedBooking.id!, selectedBooking.status, e.target.value)}
                        placeholder="Add internal concierge notes (e.g. VIP client, dietary prep communicated)..."
                        className="w-full bg-stayora-navy border border-stayora-gold/20 rounded p-2.5 text-xs text-stayora-sand focus:outline-none focus:border-stayora-gold resize-none"
                      />
                    </div>

                    <div className="pt-2 text-right">
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="btn-gold py-2 px-5 rounded text-xs uppercase tracking-wider font-semibold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOMMODATIONS MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                    Inventory & Rates
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-0.5">
                    Accommodations Catalog
                  </h1>
                </div>

                <button
                  onClick={() => openRoomModal()}
                  className="btn-gold px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Accommodation</span>
                </button>
              </div>

              {/* Rooms Grid / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((r) => (
                  <div key={r.id} className="bg-stayora-navy-deep rounded-lg border border-stayora-gold/20 overflow-hidden shadow-luxury flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={r.primary_image}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-stayora-navy/85 text-[10px] text-stayora-gold font-semibold uppercase tracking-wider border border-stayora-gold/30">
                          {r.category_name}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-stayora-navy/85 text-[10px] text-stayora-sand-light font-medium">
                          {r.is_available ? 'Available' : 'Unavailable'}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-serif text-lg text-stayora-sand-light font-semibold">
                            {r.title}
                          </h3>
                        </div>
                        <div className="font-serif text-xl font-bold text-stayora-gold">
                          {formatPrice(r.price_per_night)}
                          <span className="text-xs font-sans font-normal text-stayora-sand/60"> / night</span>
                        </div>
                        <p className="text-xs text-stayora-sand/70 line-clamp-2">
                          {r.short_description}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-stayora-sand/60 border-t border-stayora-gold/10">
                          <span>{r.size_sqft} sq ft</span>
                          <span>{r.capacity} Guests</span>
                          <span>{r.bed_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-stayora-navy-surface/50 border-t border-stayora-gold/15 flex items-center justify-between">
                      <Link
                        to={`/rooms/${r.slug}`}
                        target="_blank"
                        className="text-xs text-stayora-sand/70 hover:text-stayora-gold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </Link>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openRoomModal(r)}
                          className="p-1.5 rounded bg-stayora-navy hover:bg-stayora-gold hover:text-stayora-navy text-stayora-sand transition-colors"
                          title="Edit Room"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(r.slug, r.title)}
                          className="p-1.5 rounded bg-stayora-navy hover:bg-red-900 text-stayora-sand hover:text-red-300 transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Room Modal */}
              {roomModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-stayora-navy-deep border border-stayora-gold/40 rounded-lg max-w-2xl w-full p-6 text-stayora-sand-light shadow-2xl my-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-stayora-gold/20 mb-4">
                      <h3 className="font-serif text-xl text-stayora-sand-light">
                        {editingRoom ? `Edit: ${editingRoom.title}` : 'Add New Accommodation'}
                      </h3>
                      <button
                        onClick={() => setRoomModalOpen(false)}
                        className="p-1 text-stayora-sand/60 hover:text-stayora-sand"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Title *</label>
                          <input
                            type="text"
                            value={roomForm.title}
                            onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                            placeholder="e.g. Whispering Pine Cottage"
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Category *</label>
                          <select
                            value={roomForm.category}
                            onChange={(e) => setRoomForm({ ...roomForm, category: parseInt(e.target.value, 10) })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Nightly Tariff (INR) *</label>
                          <input
                            type="number"
                            value={roomForm.price_per_night}
                            onChange={(e) => setRoomForm({ ...roomForm, price_per_night: e.target.value })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Guest Capacity *</label>
                          <input
                            type="number"
                            value={roomForm.capacity}
                            onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value, 10) })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Floor Area (Sq Ft) *</label>
                          <input
                            type="number"
                            value={roomForm.size_sqft}
                            onChange={(e) => setRoomForm({ ...roomForm, size_sqft: parseInt(e.target.value, 10) })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Bed Configuration</label>
                          <input
                            type="text"
                            value={roomForm.bed_type}
                            onChange={(e) => setRoomForm({ ...roomForm, bed_type: e.target.value })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="uppercase tracking-wider text-stayora-gold font-semibold">Landscape View</label>
                          <input
                            type="text"
                            value={roomForm.view}
                            onChange={(e) => setRoomForm({ ...roomForm, view: e.target.value })}
                            className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="uppercase tracking-wider text-stayora-gold font-semibold">Primary Photography URL *</label>
                        <input
                          type="url"
                          value={roomForm.primary_image}
                          onChange={(e) => setRoomForm({ ...roomForm, primary_image: e.target.value })}
                          className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="uppercase tracking-wider text-stayora-gold font-semibold">Short Summary *</label>
                        <input
                          type="text"
                          value={roomForm.short_description}
                          onChange={(e) => setRoomForm({ ...roomForm, short_description: e.target.value })}
                          className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="uppercase tracking-wider text-stayora-gold font-semibold">Full Narrative Description</label>
                        <textarea
                          rows={3}
                          value={roomForm.full_description}
                          onChange={(e) => setRoomForm({ ...roomForm, full_description: e.target.value })}
                          className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-stayora-sand focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={roomForm.is_featured}
                            onChange={(e) => setRoomForm({ ...roomForm, is_featured: e.target.checked })}
                            className="rounded bg-stayora-navy text-stayora-gold"
                          />
                          <span>Signature / Featured Suite</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={roomForm.is_available}
                            onChange={(e) => setRoomForm({ ...roomForm, is_available: e.target.checked })}
                            className="rounded bg-stayora-navy text-stayora-gold"
                          />
                          <span>Active & Available for Booking</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-stayora-gold/20">
                        <button
                          type="button"
                          onClick={() => setRoomModalOpen(false)}
                          className="btn-navy py-2 px-4 rounded text-xs uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-gold py-2 px-6 rounded text-xs uppercase tracking-wider font-semibold"
                        >
                          Save Accommodation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GUEST MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                  Communications Desk
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-0.5">
                  Guest Contact Inquiries
                </h1>
              </div>

              <div className="bg-stayora-navy-deep rounded-lg border border-stayora-gold/20 shadow-luxury overflow-hidden">
                <div className="divide-y divide-stayora-gold/15">
                  {messages.length === 0 ? (
                    <div className="p-12 text-center text-stayora-sand/50 italic">
                      No contact messages received yet.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="p-6 space-y-3 hover:bg-stayora-navy-light/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-base text-stayora-sand-light font-semibold">
                              {msg.name}
                            </span>
                            <span className="text-xs text-stayora-gold">{msg.email}</span>
                            {msg.phone && <span className="text-xs text-stayora-sand/60">({msg.phone})</span>}
                          </div>
                          <div>
                            {msg.is_resolved ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-semibold">
                                Resolved
                              </span>
                            ) : (
                              <button
                                onClick={() => msg.id && handleResolveMessage(msg.id)}
                                className="px-3 py-1 rounded bg-stayora-gold/20 hover:bg-stayora-gold text-stayora-gold hover:text-stayora-navy text-[11px] font-semibold uppercase tracking-wider border border-stayora-gold/40 transition-colors"
                              >
                                Mark as Resolved
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-stayora-sand block">Subject: {msg.subject}</span>
                          <p className="text-xs text-stayora-sand/80 mt-1 leading-relaxed bg-stayora-navy/60 p-3 rounded border border-stayora-gold/10">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HOTEL SETTINGS & BRANDING */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stayora-gold font-semibold block">
                  Configuration & Customization
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-stayora-sand-light mt-0.5">
                  Hotel Branding & Contact Settings
                </h1>
                <p className="text-xs text-stayora-sand/70 mt-1">
                  Update your brand name, phone, WhatsApp concierge line, and sanctuary coordinates for individual client presentations.
                </p>
              </div>

              {settingsSaveMsg && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{settingsSaveMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-stayora-navy-deep rounded-lg border border-stayora-gold/25 p-6 sm:p-8 space-y-6 shadow-luxury">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Hotel Brand Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.site_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Concierge Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contact_phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      WhatsApp Concierge Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contact_email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address_line1}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address_line1: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">
                      Address Line 2 / Region
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address_line2}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address_line2: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2.5 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">City</label>
                    <input
                      type="text"
                      value={settingsForm.city}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">State</label>
                    <input
                      type="text"
                      value={settingsForm.state}
                      onChange={(e) => setSettingsForm({ ...settingsForm, state: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">Check-In Time</label>
                    <input
                      type="text"
                      value={settingsForm.check_in_time}
                      onChange={(e) => setSettingsForm({ ...settingsForm, check_in_time: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold">Check-Out Time</label>
                    <input
                      type="text"
                      value={settingsForm.check_out_time}
                      onChange={(e) => setSettingsForm({ ...settingsForm, check_out_time: e.target.value })}
                      className="w-full bg-stayora-navy border border-stayora-gold/30 rounded p-2 text-xs text-stayora-sand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stayora-gold/20 flex justify-end">
                  <button
                    type="submit"
                    className="btn-gold py-3 px-8 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hotel Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
