from django.contrib import admin
from .models import (
    HotelSetting, Amenity, RoomCategory, Room, RoomImage,
    BookingInquiry, GalleryItem, SpecialOffer, ContactInquiry, NewsletterSubscriber
)

class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 2

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price_per_night', 'capacity', 'size_sqft', 'is_featured', 'is_available', 'order']
    list_filter = ['category', 'is_featured', 'is_available']
    search_fields = ['title', 'short_description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [RoomImageInline]
    filter_horizontal = ['amenities']

@admin.register(BookingInquiry)
class BookingInquiryAdmin(admin.ModelAdmin):
    list_display = ['id', 'guest_name', 'guest_email', 'room_name_snapshot', 'check_in', 'check_out', 'total_nights', 'estimated_total', 'status', 'created_at']
    list_filter = ['status', 'check_in']
    search_fields = ['guest_name', 'guest_email', 'guest_phone', 'room_name_snapshot']
    readonly_fields = ['created_at', 'updated_at', 'total_nights', 'estimated_subtotal', 'estimated_tax', 'estimated_total']

@admin.register(RoomCategory)
class RoomCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'category']
    list_filter = ['category']
    search_fields = ['name']

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'order', 'created_at']
    list_filter = ['category']

@admin.register(SpecialOffer)
class SpecialOfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'discount_label', 'promo_code', 'is_active', 'order']
    list_filter = ['is_active']

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'subject', 'is_resolved', 'created_at']
    list_filter = ['is_resolved', 'created_at']
    search_fields = ['name', 'email', 'subject']

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active']
    search_fields = ['email']

@admin.register(HotelSetting)
class HotelSettingAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'tagline', 'contact_phone', 'contact_email', 'city', 'updated_at']
