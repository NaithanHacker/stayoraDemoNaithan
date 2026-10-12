import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hospitality.models import (
    HotelSetting, Amenity, RoomCategory, Room, RoomImage,
    BookingInquiry, GalleryItem, SpecialOffer, ContactInquiry, NewsletterSubscriber
)

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds initial luxury demo hospitality data for STAYORA"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding STAYORA database..."))

        # 1. Staff Superuser
        admin_user, created = User.objects.get_or_create(username="admin", defaults={
            "email": "admin@stayora.luxury",
            "is_staff": True,
            "is_superuser": True
        })
        if created:
            admin_user.set_password("Stayora@2026")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created staff user: admin / Stayora@2026"))
        else:
            admin_user.set_password("Stayora@2026")
            admin_user.save()
            self.stdout.write("Updated staff user credentials.")

        # 2. Hotel Settings
        HotelSetting.objects.update_or_create(id=1, defaults={
            "site_name": "STAYORA",
            "tagline": "Your Escape. Elevated.",
            "contact_email": "concierge@stayora.luxury",
            "contact_phone": "+91 80 4923 8800",
            "whatsapp_number": "+919876543210",
            "address_line1": "Anahata Sanctuary, Valley of Mist",
            "address_line2": "Western Ghats Escarpment",
            "city": "Coorg",
            "state": "Karnataka",
            "country": "India",
            "postal_code": "571201",
            "currency_symbol": "₹",
            "currency_code": "INR",
            "check_in_time": "14:00",
            "check_out_time": "11:00",
        })

        # 3. Amenities
        amenities_data = [
            ("High-Speed Wi-Fi", "Wifi", "General"),
            ("Infinity Plunge Pool", "Waves", "Room"),
            ("Artisanal Espresso Bar", "Coffee", "Room"),
            ("Handcrafted Soaking Tub", "Bath", "Bathroom"),
            ("Dedicated Butler Service", "Sparkles", "Services"),
            ("Monsoon Rain Shower", "Droplets", "Bathroom"),
            ("Climate Controlled Living", "Wind", "General"),
            ("Mountain Panoramic Balcony", "Mountain", "Room"),
            ("Bose Sound System", "Music", "Entertainment"),
            ("In-Suite Gourmet Dining", "Utensils", "Services"),
            ("Private Sunset Deck", "Sun", "Room"),
            ("Evening Turndown & Pillow Menu", "Moon", "Services"),
            ("Organic Herbal Bath Amenities", "Flower2", "Bathroom"),
            ("Curated Private Library", "BookOpen", "Room"),
        ]

        amenities_map = {}
        for name, icon, cat in amenities_data:
            obj, _ = Amenity.objects.get_or_create(name=name, defaults={"icon": icon, "category": cat})
            amenities_map[name] = obj

        # 4. Room Categories
        categories_data = [
            ("Suites", "suites", "Spacious open-concept sanctuaries designed for tranquil restorative stays."),
            ("Private Pool Villas", "villas", "Secluded architectural residences with private heated pools and personal gardens."),
            ("Luxury Pavilions", "pavilions", "Grand panoramic estates featuring dedicated butler service and multi-level living."),
            ("Heritage Cottages", "cottages", "Restored indigenous timber and stone dwellings steeped in quiet forest romance."),
        ]

        cat_map = {}
        for name, slug, desc in categories_data:
            c, _ = RoomCategory.objects.get_or_create(slug=slug, defaults={"name": name, "description": desc})
            cat_map[slug] = c

        # 5. Rooms
        rooms_data = [
            {
                "title": "Deluxe Garden Suite",
                "slug": "deluxe-garden-suite",
                "category": cat_map["suites"],
                "short_description": "A tranquil sanctuary opening onto private fragrant spice gardens with a sunken marble bath.",
                "full_description": "Immerse yourself in serenity within the Deluxe Garden Suite. Featuring 680 square feet of crafted elegance, this suite showcases hand-carved local timber, Italian limestone floors, and floor-to-ceiling glass doors opening onto an enclosed private tropical garden. Unwind in the deep sunken soaking tub with artisanal botanical bath infusions, or sip pour-over estate coffee on your secluded patio as misty mountain mornings unfurl.",
                "price_per_night": Decimal("18500.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 2,
                "bed_type": "King Plush Bed",
                "size_sqft": 680,
                "view": "Fragrant Spice Gardens & Valley Mist",
                "primary_image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
                "is_featured": True,
                "is_available": True,
                "order": 1,
                "amenity_names": ["High-Speed Wi-Fi", "Artisanal Espresso Bar", "Handcrafted Soaking Tub", "Monsoon Rain Shower", "Climate Controlled Living", "In-Suite Gourmet Dining", "Evening Turndown & Pillow Menu", "Organic Herbal Bath Amenities"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85", "Primary Suite Bedroom"),
                    ("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85", "Sunken Soaking Bath"),
                    ("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85", "Private Garden Patio"),
                ]
            },
            {
                "title": "Executive Valley Suite",
                "slug": "executive-valley-suite",
                "category": cat_map["suites"],
                "short_description": "Perched on the ridge line featuring floor-to-ceiling escarpment vistas and a cantilevered viewing lounge.",
                "full_description": "The Executive Valley Suite commands breathtaking, uninterrupted vistas across the Western Ghats escarpment. Encompassing 950 square feet of light-filled architectural luxury, this haven features a double-sided fireplace, custom brass fittings, an expansive cedar viewing balcony, and a dedicated library lounge. Ideal for couples or executives seeking peaceful creative contemplation amidst virgin mountain landscapes.",
                "price_per_night": Decimal("27000.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 3,
                "bed_type": "California King Bed",
                "size_sqft": 950,
                "view": "Panoramic Western Ghats Ridge",
                "primary_image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
                "is_featured": True,
                "is_available": True,
                "order": 2,
                "amenity_names": ["High-Speed Wi-Fi", "Mountain Panoramic Balcony", "Artisanal Espresso Bar", "Handcrafted Soaking Tub", "Bose Sound System", "Curated Private Library", "Climate Controlled Living", "Evening Turndown & Pillow Menu"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85", "Executive Valley Bed & Lounge"),
                    ("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85", "Panoramic Valley Living Area"),
                    ("https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85", "Spa-Style Ensuite"),
                ]
            },
            {
                "title": "Private Pool Villa",
                "slug": "private-pool-villa",
                "category": cat_map["villas"],
                "short_description": "An intimate luxury sanctuary with a heated infinity plunge pool, open-air sun deck, and forest canopy seclusion.",
                "full_description": "Our Private Pool Villa is a triumph of tropical minimalist architecture. Secluded among ancient coffee groves and whispering pine trees, this 1,450 square foot villa features an outdoor heated infinity plunge pool, open-air teak sun deck, outdoor rainforest shower, and bespoke interior salon. Wake up to bird song, take an evening dip under starlit skies, and enjoy bespoke dining served poolside by your concierge team.",
                "price_per_night": Decimal("42500.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 4,
                "bed_type": "Master King Bed + Daybed",
                "size_sqft": 1450,
                "view": "Private Forest Canopy & Sunset Valley",
                "primary_image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85",
                "is_featured": True,
                "is_available": True,
                "order": 3,
                "amenity_names": ["Infinity Plunge Pool", "High-Speed Wi-Fi", "Private Sunset Deck", "Dedicated Butler Service", "In-Suite Gourmet Dining", "Handcrafted Soaking Tub", "Monsoon Rain Shower", "Bose Sound System"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85", "Private Heated Pool & Sun Deck"),
                    ("https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85", "Villa Interior Living Room"),
                    ("https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1600&q=85", "Master Suite Overlooking Pool"),
                ]
            },
            {
                "title": "Presidential Grand Pavilion",
                "slug": "presidential-grand-pavilion",
                "category": cat_map["pavilions"],
                "short_description": "The pinnacle of bespoke hospitality. Two master suites, 12-meter private heated pool, butler kitchen, and outdoor fireplace.",
                "full_description": "The crown jewel of STAYORA, the Presidential Grand Pavilion offers 2,600 square feet of peerless exclusivity. Comprising two palatial master suites with walk-in dressing parlors, an expansive open salon with 18-foot vaulted ceilings, a private 12-meter heated swimming pool, an outdoor sunken fire pit, and a full butler prep kitchen. Guests enjoy round-the-clock dedicated butler service, curated wine cellar selections, and private chef dining experiences.",
                "price_per_night": Decimal("78000.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 6,
                "bed_type": "Two Emperor King Suites",
                "size_sqft": 2600,
                "view": "360° Mountain Crest & Valley Infinity",
                "primary_image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
                "is_featured": True,
                "is_available": True,
                "order": 4,
                "amenity_names": ["Infinity Plunge Pool", "Dedicated Butler Service", "Private Sunset Deck", "Bose Sound System", "In-Suite Gourmet Dining", "Curated Private Library", "Handcrafted Soaking Tub", "High-Speed Wi-Fi", "Evening Turndown & Pillow Menu"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85", "Grand Pavilion Master Bedroom"),
                    ("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", "Grand Living Hall & Glass Facade"),
                    ("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85", "Private Pavilion Pool & Sun Loungers"),
                ]
            },
            {
                "title": "Canopy Treehouse Villa",
                "slug": "canopy-treehouse-villa",
                "category": cat_map["villas"],
                "short_description": "Elevated living suspended among ancient mahogany canopies with a copper soaking tub on the forest deck.",
                "full_description": "Elevate your senses in this modern architectural treehouse villa perched 25 feet above the forest floor. Built sustainably around towering teak and mahogany trees, this 880 square foot eco-luxury retreat features a panoramic wraparound cedar deck, an outdoor hammered copper soaking tub, and bespoke minimalist interiors crafted from reclaimed hardwoods.",
                "price_per_night": Decimal("34000.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 2,
                "bed_type": "King Plush Bed",
                "size_sqft": 880,
                "view": "Forest Canopy & Bird Sanctuary",
                "primary_image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=85",
                "is_featured": False,
                "is_available": True,
                "order": 5,
                "amenity_names": ["Handcrafted Soaking Tub", "High-Speed Wi-Fi", "Mountain Panoramic Balcony", "Artisanal Espresso Bar", "Organic Herbal Bath Amenities", "Sunset Yoga Deck"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=85", "Canopy Villa Exterior & Deck"),
                    ("https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85", "Warm Timber Treehouse Bedroom"),
                ]
            },
            {
                "title": "Riverside Heritage Cottage",
                "slug": "riverside-heritage-cottage",
                "category": cat_map["cottages"],
                "short_description": "A stone and antique timber dwelling nestled beside a crystalline mountain stream with outdoor wood-fired hearth.",
                "full_description": "Rooted in authentic regional heritage, this cottage was hand-assembled using dressed river stone, terracotta roof tiles, and 90-year-old salvaged rosewood pillars. Situated directly along the serene banks of the estate river, enjoy the gentle murmur of flowing water, crackling evenings by the outdoor wood-fired hearth, and handcrafted hospitality tailored to every detail.",
                "price_per_night": Decimal("22000.00"),
                "tax_percentage": Decimal("18.00"),
                "capacity": 3,
                "bed_type": "Four-Poster King Bed",
                "size_sqft": 780,
                "view": "Mountain River & Bamboo Grove",
                "primary_image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
                "is_featured": False,
                "is_available": True,
                "order": 6,
                "amenity_names": ["High-Speed Wi-Fi", "Artisanal Espresso Bar", "Handcrafted Soaking Tub", "Curated Private Library", "Evening Turndown & Pillow Menu", "In-Suite Gourmet Dining"],
                "gallery": [
                    ("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85", "Heritage Cottage Living Room"),
                    ("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85", "Four-Poster Master Suite"),
                ]
            }
        ]

        for rdata in rooms_data:
            amenity_names = rdata.pop("amenity_names")
            gallery = rdata.pop("gallery")
            room, _ = Room.objects.update_or_create(slug=rdata["slug"], defaults=rdata)
            
            # Amenities
            room_amenities = [amenities_map[name] for name in amenity_names if name in amenities_map]
            room.amenities.set(room_amenities)

            # Gallery images
            RoomImage.objects.filter(room=room).delete()
            for idx, (img_url, cap) in enumerate(gallery):
                RoomImage.objects.create(room=room, image_url=img_url, caption=cap, order=idx)

        # 6. Special Offers
        offers_data = [
            {
                "title": "The Romantic Sanctuary Escape",
                "subtitle": "Designed for intimate celebration and secluded restorative luxury.",
                "discount_label": "Complimentary Spa Ritual & Candlelit 4-Course Dinner",
                "description": "Includes a 60-minute couple's Ayurvedic Marma massage at Soma Spa, sunset champagne welcome, daily artisanal breakfast on your private terrace, and a private candlelight dinner beneath the mountain stars.",
                "promo_code": "ROMANCE2026",
                "validity_info": "Valid through November 30, 2026",
                "image_url": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85",
                "is_active": True,
                "order": 1
            },
            {
                "title": "Extended Solitude (Stay 4, Pay 3)",
                "subtitle": "Indulge in prolonged peace across our misty mountain estate.",
                "discount_label": "Complimentary 4th Night + Estate Tea Masterclass",
                "description": "Book three consecutive nights in any suite or pool villa and receive your fourth night complimentary. Includes estate-guided forest bathing, private tea sommelier tasting, and airport transfers.",
                "promo_code": "SOLITUDE26",
                "validity_info": "Valid year-round on midweek reservations",
                "image_url": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=85",
                "is_active": True,
                "order": 2
            },
            {
                "title": "The Culinary & Harvest Journey",
                "subtitle": "An immersive gastronomic experience led by Executive Chef Aarav.",
                "discount_label": "Chef’s Tasting Menu & Guided Organic Farm Tour",
                "description": "Experience daily multi-course degustation dining at Aura, an interactive wild spice forage, and paired wine selections from our sommelier’s private cellar.",
                "promo_code": "HARVEST26",
                "validity_info": "Valid for weekend stays in 2026",
                "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
                "is_active": True,
                "order": 3
            }
        ]

        for odata in offers_data:
            SpecialOffer.objects.update_or_create(title=odata["title"], defaults=odata)

        # 7. Gallery Items
        gallery_data = [
            ("Escarpment Infinity Pool", "Wellness", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85", "Heated horizon pool overlooking cloud-draped valleys"),
            ("Aura Fine Dining Room", "Dining", "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85", "Contemporary culinary temple celebrating heritage terroir"),
            ("Soma Ayurvedic Sanctuary", "Wellness", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", "Holistic wellness treatment room with herbal oil therapies"),
            ("Sunset Ridge Pavilion", "Architecture", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", "Cantilevered stone and glass pavilion at golden hour"),
            ("Private Pool Villa Deck", "Rooms", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", "Plunge pool enveloped by lush tropical mountain canopy"),
            ("Estate Coffee & Tea Trails", "Grounds", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85", "Centuries-old misty plantation walking trails"),
            ("The Cellar & Tasting Lounge", "Dining", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85", "Bespoke temperature-controlled cellar and tasting room"),
            ("Executive Suite Fireside", "Rooms", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85", "Warm brass, plush linens, and flickering evening fire"),
            ("Morning Yoga Shala", "Wellness", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85", "Open-air bamboo deck greeting the dawn mountain breeze"),
        ]

        GalleryItem.objects.all().delete()
        for idx, (title, cat, url, cap) in enumerate(gallery_data):
            GalleryItem.objects.create(title=title, category=cat, image_url=url, caption=cap, order=idx)

        # 8. Sample Booking Inquiries (realistic demo records)
        deluxe = Room.objects.filter(slug="deluxe-garden-suite").first()
        pool_villa = Room.objects.filter(slug="private-pool-villa").first()
        exec_suite = Room.objects.filter(slug="executive-valley-suite").first()

        today = datetime.date.today()
        sample_inquiries = [
            {
                "room": pool_villa,
                "guest_name": "Vikramaditya Singhania",
                "guest_email": "vikram.singhania@heritageholdings.in",
                "guest_phone": "+91 98201 44521",
                "check_in": today + datetime.timedelta(days=7),
                "check_out": today + datetime.timedelta(days=10),
                "num_guests": 2,
                "num_rooms": 1,
                "special_requests": "Celebrating our 10th wedding anniversary. Kindly arrange champagne on arrival and a poolside candlelit dinner on the second evening.",
                "status": "CONFIRMED",
                "staff_notes": "VIP anniversary setup confirmed with F&B. Room upgraded to highest canopy vantage point.",
            },
            {
                "room": exec_suite,
                "guest_name": "Ananya Kulkarni",
                "guest_email": "ananya.kulkarni@designstudio.co",
                "guest_phone": "+91 99805 12890",
                "check_in": today + datetime.timedelta(days=14),
                "check_out": today + datetime.timedelta(days=17),
                "num_guests": 2,
                "num_rooms": 1,
                "special_requests": "Requesting quiet floor facing sunrise. Dairy-free options for breakfast.",
                "status": "CONTACTED",
                "staff_notes": "Called guest on Oct 10; confirmed dietary requirements sent to Chef Aarav.",
            },
            {
                "room": deluxe,
                "guest_name": "Marcus & Elena Vance",
                "guest_email": "marcus.vance@architecturaldigest.uk",
                "guest_phone": "+44 7911 123456",
                "check_in": today + datetime.timedelta(days=22),
                "check_out": today + datetime.timedelta(days=26),
                "num_guests": 2,
                "num_rooms": 1,
                "special_requests": "Architectural photography inquiry during our stay. Would love a short walkthrough of the heritage timber restoration.",
                "status": "PENDING",
                "staff_notes": "Awaiting concierge confirmation on curator availability.",
            }
        ]

        BookingInquiry.objects.all().delete()
        for inq in sample_inquiries:
            BookingInquiry.objects.create(**inq)

        # 9. Sample Contact Inquiries
        sample_contacts = [
            {
                "name": "Devika Menon",
                "email": "devika.menon@artfoundation.org",
                "phone": "+91 98450 77112",
                "subject": "Private Retreat Buyout Inquiry for 25 Guests",
                "message": "We are planning a corporate leadership and mindfulness retreat for 25 senior executives in January 2027. We would like to inquire about a complete resort buyout option for 3 nights.",
                "is_resolved": False
            },
            {
                "name": "Rohit Chandrasekhar",
                "email": "rohit.c@venturecap.in",
                "phone": "+91 99001 23489",
                "subject": "Helipad and Chauffeur Transfers",
                "message": "Does the estate accommodate private helicopter charters from Bangalore Kempegowda International Airport, or what is the recommended private chauffeur duration?",
                "is_resolved": True
            }
        ]

        ContactInquiry.objects.all().delete()
        for cdata in sample_contacts:
            ContactInquiry.objects.create(**cdata)

        # 10. Sample Newsletter Subscribers
        subscribers = ["priya.sharma@outlook.com", "david.kim@singaporeair.com", "arjun.nambiar@luxurytravel.in"]
        for email in subscribers:
            NewsletterSubscriber.objects.get_or_create(email=email)

        self.stdout.write(self.style.SUCCESS("STAYORA database successfully seeded with luxury hospitality demo data!"))
