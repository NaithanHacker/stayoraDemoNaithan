from django.db import models
from django.core.exceptions import ValidationError
from decimal import Decimal

class HotelSetting(models.Model):
    site_name = models.CharField(max_length=120, default="STAYORA")
    tagline = models.CharField(max_length=255, default="Your Escape. Elevated.")
    contact_email = models.EmailField(default="concierge@stayora.luxury")
    contact_phone = models.CharField(max_length=50, default="+91 80 4923 8800")
    whatsapp_number = models.CharField(max_length=50, default="+919876543210")
    address_line1 = models.CharField(max_length=255, default="Anahata Sanctuary, Valley of Mist")
    address_line2 = models.CharField(max_length=255, default="Western Ghats Escarpment")
    city = models.CharField(max_length=100, default="Coorg")
    state = models.CharField(max_length=100, default="Karnataka")
    country = models.CharField(max_length=100, default="India")
    postal_code = models.CharField(max_length=20, default="571201")
    currency_symbol = models.CharField(max_length=10, default="₹")
    currency_code = models.CharField(max_length=10, default="INR")
    check_in_time = models.CharField(max_length=20, default="14:00")
    check_out_time = models.CharField(max_length=20, default="11:00")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.site_name} Settings"

    class Meta:
        verbose_name = "Hotel Setting"
        verbose_name_plural = "Hotel Settings"


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default="Sparkles", help_text="Lucide icon identifier")
    category = models.CharField(max_length=50, default="General")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Amenities"


class RoomCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Room Categories"


class Room(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    category = models.ForeignKey(RoomCategory, on_delete=models.CASCADE, related_name='rooms')
    short_description = models.CharField(max_length=300)
    full_description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, help_text="Base rate per night in INR")
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('18.00'), help_text="Tax percentage (e.g. 18%)")
    capacity = models.PositiveIntegerField(default=2, help_text="Max adults / guests")
    bed_type = models.CharField(max_length=100, default="King Bed")
    size_sqft = models.PositiveIntegerField(default=650, help_text="Room size in square feet")
    view = models.CharField(max_length=120, default="Valley & Cloud View")
    primary_image = models.URLField(max_length=500)
    amenities = models.ManyToManyField(Amenity, blank=True, related_name='rooms')
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (₹{self.price_per_night}/night)"

    class Meta:
        ordering = ['order', 'price_per_night']


class RoomImage(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='gallery_images')
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.room.title} - Image {self.id}"

    class Meta:
        ordering = ['order', 'id']


class BookingInquiry(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('CONTACTED', 'Guest Contacted'),
        ('CONFIRMED', 'Reservation Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]

    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    room_name_snapshot = models.CharField(max_length=200, blank=True)
    guest_name = models.CharField(max_length=150)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=30)
    check_in = models.DateField()
    check_out = models.DateField()
    num_guests = models.PositiveIntegerField(default=2)
    num_rooms = models.PositiveIntegerField(default=1)
    total_nights = models.PositiveIntegerField(default=1)
    price_per_night_snapshot = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    estimated_subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    estimated_tax = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    estimated_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    staff_notes = models.TextField(blank=True)
    is_demo = models.BooleanField(default=True, help_text="Always True to indicate demo inquiry environment")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.check_in and self.check_out:
            if self.check_out <= self.check_in:
                raise ValidationError("Check-out date must be strictly after the check-in date.")

    def save(self, *args, **kwargs):
        self.clean()
        if self.room:
            if not self.room_name_snapshot:
                self.room_name_snapshot = self.room.title
            if not self.price_per_night_snapshot:
                self.price_per_night_snapshot = self.room.price_per_night
            
            # Recalculate nights and totals if not set
            if self.check_in and self.check_out:
                delta = (self.check_out - self.check_in).days
                self.total_nights = max(delta, 1)
                subtotal = self.price_per_night_snapshot * self.total_nights * self.num_rooms
                tax_rate = self.room.tax_percentage / Decimal('100.00')
                tax = subtotal * tax_rate
                self.estimated_subtotal = subtotal
                self.estimated_tax = tax
                self.estimated_total = subtotal + tax
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Inquiry #{self.id} - {self.guest_name} ({self.room_name_snapshot})"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Booking Inquiries"


class GalleryItem(models.Model):
    CATEGORY_CHOICES = [
        ('Rooms', 'Rooms & Suites'),
        ('Dining', 'Fine Dining'),
        ('Wellness', 'Spa & Wellness'),
        ('Grounds', 'Sanctuary & Nature'),
        ('Architecture', 'Design & Architecture'),
    ]

    title = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Rooms')
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"

    class Meta:
        ordering = ['order', '-id']


class SpecialOffer(models.Model):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=200)
    discount_label = models.CharField(max_length=100)
    description = models.TextField()
    promo_code = models.CharField(max_length=50, default="STAYORA26")
    validity_info = models.CharField(max_length=150, default="Valid for stays through December 2026")
    image_url = models.URLField(max_length=500)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order', '-id']


class ContactInquiry(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contact from {self.name}: {self.subject}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Contact Inquiries"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-subscribed_at']
