import {
  HotelSetting, Room, RoomCategory, Amenity, BookingInquiry,
  GalleryItem, SpecialOffer, ContactInquiry, AdminMetrics, AuthUser
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('stayora_auth_token');
  return token ? { 'Authorization': `Token ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data.detail) errorDetail = data.detail;
      else if (typeof data === 'object') errorDetail = JSON.stringify(data);
    } catch {
      // response wasn't json
    }
    throw new Error(errorDetail);
  }

  // If 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Settings
  async getSettings(): Promise<HotelSetting> {
    try {
      return await request<HotelSetting>('/settings/');
    } catch (e) {
      console.warn('API getSettings failed, using fallback default settings:', e);
      return {
        site_name: "STAYORA",
        tagline: "Your Escape. Elevated.",
        contact_email: "concierge@stayora.luxury",
        contact_phone: "+91 80 4923 8800",
        whatsapp_number: "+919876543210",
        address_line1: "Anahata Sanctuary, Valley of Mist",
        address_line2: "Western Ghats Escarpment",
        city: "Coorg",
        state: "Karnataka",
        country: "India",
        postal_code: "571201",
        currency_symbol: "₹",
        currency_code: "INR",
        check_in_time: "14:00",
        check_out_time: "11:00",
      };
    }
  },

  async updateSettings(data: Partial<HotelSetting>): Promise<HotelSetting> {
    return request<HotelSetting>('/settings/1/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Rooms
  async getRooms(params: Record<string, string | number | boolean> = {}): Promise<Room[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<any>(`/rooms/${qs}`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async getRoomBySlug(slug: string): Promise<Room> {
    return request<Room>(`/rooms/${slug}/`);
  },

  async createRoom(data: any): Promise<Room> {
    return request<Room>('/rooms/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRoom(slug: string, data: any): Promise<Room> {
    return request<Room>(`/rooms/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteRoom(slug: string): Promise<void> {
    return request<void>(`/rooms/${slug}/`, {
      method: 'DELETE',
    });
  },

  // Categories & Amenities
  async getCategories(): Promise<RoomCategory[]> {
    const res = await request<any>('/categories/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getAmenities(): Promise<Amenity[]> {
    const res = await request<any>('/amenities/');
    return Array.isArray(res) ? res : res.results || [];
  },

  // Bookings
  async createBookingInquiry(data: BookingInquiry): Promise<BookingInquiry> {
    return request<BookingInquiry>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBookings(params: Record<string, string> = {}): Promise<BookingInquiry[]> {
    const query = new URLSearchParams(params);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<any>(`/bookings/${qs}`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async updateBooking(id: number, data: Partial<BookingInquiry>): Promise<BookingInquiry> {
    return request<BookingInquiry>(`/bookings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const qs = category && category !== 'All' ? `?category=${category}` : '';
    const res = await request<any>(`/gallery/${qs}`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    return request<GalleryItem>('/gallery/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteGalleryItem(id: number): Promise<void> {
    return request<void>(`/gallery/${id}/`, {
      method: 'DELETE',
    });
  },

  // Special Offers
  async getOffers(): Promise<SpecialOffer[]> {
    const res = await request<any>('/offers/');
    return Array.isArray(res) ? res : res.results || [];
  },

  // Contact
  async createContactInquiry(data: ContactInquiry): Promise<ContactInquiry> {
    return request<ContactInquiry>('/contact/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const res = await request<any>('/contact/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async resolveContactInquiry(id: number): Promise<ContactInquiry> {
    return request<ContactInquiry>(`/contact/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_resolved: true }),
    });
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ detail: string }> {
    return request<{ detail: string }>('/newsletter/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Admin Auth & Metrics
  async adminLogin(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
    return request<{ token: string; user: AuthUser }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async adminMe(): Promise<AuthUser> {
    return request<AuthUser>('/auth/me/');
  },

  async getAdminMetrics(): Promise<AdminMetrics> {
    return request<AdminMetrics>('/admin/metrics/');
  },
};
