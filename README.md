# STAYORA — Luxury Hospitality & Sanctuary Digital Product

> **"Your Escape. Elevated."**  
> A production-quality, cinematic digital platform for luxury hotels, boutique resorts, and wellness sanctuaries. Engineered for high-conversion guest experiences and effortless staff operations.

---

## 1. Brand Identity & Visual Direction

STAYORA is conceived not as a generic hotel template, but as a bespoke luxury brand built for prospective hospitality clients, resort owners, and boutique retreat developers.

- **Color Palette:**
  - **Midnight Navy (`#0A1128`, `#060B18`):** Deep, grounding architectural twilight.
  - **Champagne Gold (`#C5A880`, `#DFCCA8`):** Refined metallic accents, borders, and tactile highlights.
  - **Warm Ivory (`#FDFCFA`, `#FAF8F5`):** Serene breathing room and pristine readability.
  - **Muted Sand (`#EFECE6`, `#D8D3C8`):** Organic stone and timber undertones.
- **Typography:**
  - **Serif Headlines:** Google Fonts *Playfair Display* for cinematic elegance and heritage stature.
  - **Modern Sans-Serif:** Google Fonts *Plus Jakarta Sans* for clean typography, legible booking tariffs, and UI clarity.
- **Atmosphere:**
  - Generous whitespace, refined micro-interactions, and glassmorphism.
  - Full-fidelity photography showcasing authentic suites, pools, and Ayurvedic sanctuaries.
  - Transparent pricing in Indian Rupees (**INR ₹**) with night calculations and GST breakdowns.
  - Discreet demo environment disclosures ensuring client transparency.

---

## 2. Architecture & Tech Stack

```
stayora/
├── backend/                   # Python Django REST Framework
│   ├── hospitality/           # Core hospitality application
│   │   ├── models.py          # Relational models (Rooms, Bookings, Gallery, Offers, Settings)
│   │   ├── views.py           # DRF API ViewSets & Staff Auth Views
│   │   ├── serializers.py     # Clean data schemas & validators
│   │   ├── urls.py            # REST routing
│   │   └── management/
│   │       └── commands/
│   │           └── seed_data.py # Automated realistic luxury data seeder
│   ├── stayora_api/           # Django project configuration & settings
│   ├── requirements.txt       # Python dependencies (Django 5, DRF, Whitenoise, CORS, dj-database-url)
│   ├── .env.example           # Environment variables template
│   └── manage.py
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/common/ # Navbar, Footer, BookingModal, BookingSearchBar, RoomCard, Lightbox, WhatsAppButton
│   │   ├── context/           # AuthContext (Staff Token Auth), SettingsContext (Global Hotel Branding)
│   │   ├── pages/             # HomePage, RoomsPage, RoomDetailPage, ExperiencesPage, GalleryPage, AboutPage, ContactPage
│   │   │   └── admin/         # AdminLoginPage, AdminDashboardPage
│   │   ├── services/api.ts    # REST API client with offline fallback resilience
│   │   ├── types/index.ts     # TypeScript data models
│   │   └── index.css          # Tailwind utilities, gold glow, and glassmorphism styles
│   ├── package.json
│   ├── tailwind.config.js     # Custom luxury color tokens & font families
│   └── vercel.json            # Single Page Application routing for Vercel
├── render.yaml                # Render Infrastructure-as-Code for Django & PostgreSQL
├── start-backend.ps1          # One-click backend startup script
├── start-frontend.ps1         # One-click frontend startup script
└── README.md
```

---

## 3. Key Implemented Features

### Public Guest Experience
1. **Cinematic Homepage:**
   - Hero video/photography backdrop with smooth scroll reveal and subtle gold branding.
   - Floating interactive booking search bar with check-in, check-out, guests, and category filters.
   - Featured suites showcase (Deluxe Suite, Executive Suite, Private Pool Villa, Presidential Grand Pavilion).
   - Editorial showcase for Fine Dining (*Aura*), Escarpment Horizon Pool, and *Soma* Ayurvedic Spa.
   - The Four Pillars of Stayora ethos.
   - Interactive Photo Gallery with filter pills and full-screen lightbox modal.
   - Sample guest reviews clearly labeled as demonstration testimonials.
   - Special seasonal offers (*Romantic Sanctuary*, *Stay 4 Pay 3*, *Culinary Harvest*).
   - Fictional sanctuary coordinates in Coorg, Karnataka with airport driving durations.
   - Newsletter registration with validation.
2. **Dedicated Accommodations Catalog (`/rooms`):**
   - Category filtering (All, Suites, Villas, Pavilions, Cottages).
   - Capacity filters and price sorting (Low to High, High to Low, Floor Area).
   - Specifications for room dimensions, capacity, bed types, and amenity badges.
3. **Room Detail Deep-Dive (`/rooms/:slug`):**
   - High-resolution multi-angle image gallery with thumbnail selector.
   - Full narrative room description, terrace view, and house policies.
   - Sticky live price calculator with strict check-in/check-out date validation.
   - Direct inquiry button and instant WhatsApp concierge link with prefilled room details.
4. **Booking Inquiry Flow:**
   - Multi-step modal with live night calculation and 18% GST tax breakdown in INR.
   - Collects guest contact details and custom requests.
   - Persists inquiries directly into the database.
   - Never prompts for or stores payment card information.
5. **Experiences (`/experiences`), Visual Gallery (`/gallery`), & About (`/about`):**
   - Editorial gastronomy, wellness therapies, and 140-acre biosphere trails.
   - Brand history, vernacular stone & reclaimed timber architecture, and sustainability charter.
6. **Contact & WhatsApp Concierge (`/contact`):**
   - Contact form with validation and backend storage.
   - Floating WhatsApp button with dynamic greeting and pre-filled inquiry text.

### Staff Administrative Dashboard (`/admin`)
- **Protected Access:** Token-based authentication.
- **KPI Overview:** Total inquiries, pending review count, confirmed bookings, and pipeline INR value.
- **Booking Management:** Search by guest, filter by status (`PENDING`, `CONTACTED`, `CONFIRMED`, `CANCELLED`), update reservation status, and attach internal concierge staff notes.
- **Accommodations Manager:** Create, update, or remove rooms with custom photos, descriptions, and INR rates.
- **Guest Inquiries:** Review incoming messages and mark inquiries resolved.
- **Live Hotel Settings:** Change hotel name, tagline, phone, WhatsApp line, address, and check-in/out times.

---

## 4. Quick Start Guide (Local Setup)

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Step 1: Backend Setup
```bash
cd stayora/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed database
python manage.py migrate
python manage.py seed_data

# Start backend server
python manage.py runserver 0.0.0.0:8000
```
Backend API will be running at `http://127.0.0.1:8000/api/`.

### Step 2: Frontend Setup
In a new terminal:
```bash
cd stayora/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173/`.

---

## 5. Staff Admin Credentials

| Parameter | Value |
|---|---|
| **Portal URL** | `http://localhost:5173/admin/login` |
| **Username** | `admin` |
| **Password** | `Stayora@2026` |
| **Django Admin** | `http://127.0.0.1:8000/django-admin/` |

---

## 6. REST API Endpoints Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/settings/` | Public | Hotel branding and contact information |
| `PATCH`| `/api/settings/1/` | Staff | Update branding and contact info |
| `GET` | `/api/rooms/` | Public | List rooms with category/price/guests filters |
| `GET` | `/api/rooms/<slug>/` | Public | Get single room details and gallery |
| `POST`| `/api/rooms/` | Staff | Add new room to inventory |
| `PATCH`| `/api/rooms/<slug>/`| Staff | Edit room rates, amenities, or images |
| `DELETE`| `/api/rooms/<slug>/`| Staff | Remove room from catalog |
| `POST`| `/api/bookings/` | Public | Submit booking inquiry (calculates nights & GST) |
| `GET` | `/api/bookings/` | Staff | List bookings with status and search filters |
| `PATCH`| `/api/bookings/<id>/`| Staff | Update booking status (`CONFIRMED`, `CANCELLED`, etc.) |
| `GET` | `/api/gallery/` | Public | List high-res gallery images by category |
| `GET` | `/api/offers/` | Public | List active seasonal packages |
| `POST`| `/api/contact/` | Public | Submit guest contact inquiry |
| `GET` | `/api/contact/` | Staff | View received contact messages |
| `POST`| `/api/newsletter/` | Public | Guest newsletter email subscription |
| `POST`| `/api/auth/login/` | Public | Authenticate staff user and receive API token |
| `GET` | `/api/admin/metrics/` | Staff | Dashboard overview KPIs and pipeline valuation |

---

## 7. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push `stayora` to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. In Project Settings > Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://stayora-backend.onrender.com/api`).
5. The included `vercel.json` ensures client-side routing works seamlessly on all direct URLs.

### Backend Deployment (Render with PostgreSQL)
1. In [Render](https://render.com), create a new **Blueprint** using `render.yaml` or create a **Web Service**:
   - Environment: `Python 3`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate && python manage.py seed_data`
   - Start Command: `gunicorn stayora_api.wsgi:application`
2. Attach a managed Render PostgreSQL database (or supply `DATABASE_URL`).
3. Set Environment Variables:
   - `SECRET_KEY`: Long random production key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.onrender.com`
   - `DATABASE_URL`: Connection string from your managed PostgreSQL instance.

---

## 8. Client Customization Guide

For freelance presentations or client pitches:
1. **Rebranding:** Log into `/admin`, navigate to **Hotel Branding**, and customize the Hotel Name, Tagline, Phone, WhatsApp number, and Sanctuary Coordinates. Changes propagate across the website instantly.
2. **Pricing & Inventory:** Update nightly tariffs to match client properties (boutique homestay vs. luxury palace resort).
3. **Curated Photography:** Replace Unsplash placeholder URLs in `RoomImage` and `GalleryItem` with authentic high-resolution client photos.
