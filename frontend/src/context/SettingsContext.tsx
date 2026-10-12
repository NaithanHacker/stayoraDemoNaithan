import React, { createContext, useContext, useState, useEffect } from 'react';
import { HotelSetting } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: HotelSetting;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (data: Partial<HotelSetting>) => Promise<void>;
  formatPrice: (amount: number | string) => string;
  getWhatsAppUrl: (roomName?: string, checkIn?: string, checkOut?: string, guests?: number) => string;
}

const defaultSettings: HotelSetting = {
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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HotelSetting>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && data.site_name) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('Could not load remote settings, using default settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (data: Partial<HotelSetting>) => {
    const updated = await api.updateSettings(data);
    setSettings(updated);
  };

  const formatPrice = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${settings.currency_symbol}0`;
    return `${settings.currency_symbol}${num.toLocaleString('en-IN')}`;
  };

  const getWhatsAppUrl = (roomName?: string, checkIn?: string, checkOut?: string, guests?: number): string => {
    const cleanNumber = settings.whatsapp_number.replace(/[^\d]/g, '');
    let text = `Hello ${settings.site_name} concierge, I would like to inquire about reserving a stay.`;
    if (roomName) {
      text = `Hello ${settings.site_name} concierge, I would like to inquire about reserving the ${roomName}`;
      if (checkIn && checkOut) {
        text += ` from ${checkIn} to ${checkOut}`;
      }
      if (guests) {
        text += ` for ${guests} guests`;
      }
      text += `. Could you kindly assist with availability and bespoke arrangements?`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      isLoading,
      refreshSettings: fetchSettings,
      updateSettings,
      formatPrice,
      getWhatsAppUrl
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
