export interface Amenity {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface RoomCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  room_count?: number;
}

export interface RoomImage {
  id: number;
  room: number;
  image_url: string;
  caption: string;
  order: number;
}

export interface Room {
  id: number;
  title: string;
  slug: string;
  category: number;
  category_name: string;
  category_slug: string;
  short_description: string;
  full_description?: string;
  price_per_night: string | number;
  tax_percentage: string | number;
  capacity: number;
  bed_type: string;
  size_sqft: number;
  view: string;
  primary_image: string;
  amenities: Amenity[];
  gallery_images?: RoomImage[];
  is_featured: boolean;
  is_available: boolean;
  order: number;
}

export interface BookingInquiry {
  id?: number;
  room?: number | null;
  room_title?: string;
  room_slug?: string;
  room_name_snapshot?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  num_guests: number;
  num_rooms: number;
  total_nights?: number;
  price_per_night_snapshot?: string | number;
  estimated_subtotal?: string | number;
  estimated_tax?: string | number;
  estimated_total?: string | number;
  special_requests?: string;
  status?: 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED';
  staff_notes?: string;
  is_demo?: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: 'All' | 'Rooms' | 'Dining' | 'Wellness' | 'Grounds' | 'Architecture';
  image_url: string;
  caption: string;
  order: number;
}

export interface SpecialOffer {
  id: number;
  title: string;
  subtitle: string;
  discount_label: string;
  description: string;
  promo_code: string;
  validity_info: string;
  image_url: string;
  is_active: boolean;
  order: number;
}

export interface HotelSetting {
  id?: number;
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  currency_symbol: string;
  currency_code: string;
  check_in_time: string;
  check_out_time: string;
}

export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_resolved?: boolean;
  created_at?: string;
}

export interface AdminMetrics {
  inquiries: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
    cancelled: number;
  };
  revenue: {
    total_pipeline: number;
    confirmed_pipeline: number;
  };
  inventory: {
    total_rooms: number;
    unread_contacts: number;
    subscribers: number;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}
