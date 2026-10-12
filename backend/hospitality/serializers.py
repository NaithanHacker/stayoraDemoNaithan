from rest_framework import serializers
from .models import (
    HotelSetting, Amenity, RoomCategory, Room, RoomImage,
    BookingInquiry, GalleryItem, SpecialOffer, ContactInquiry, NewsletterSubscriber
)
from decimal import Decimal

class HotelSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelSetting
        fields = '__all__'


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'


class RoomCategorySerializer(serializers.ModelSerializer):
    room_count = serializers.IntegerField(source='rooms.count', read_only=True)

    class Meta:
        model = RoomCategory
        fields = ['id', 'name', 'slug', 'description', 'room_count']


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'room', 'image_url', 'caption', 'order']


class RoomListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'short_description', 'price_per_night', 'tax_percentage',
            'capacity', 'bed_type', 'size_sqft', 'view', 'primary_image',
            'amenities', 'is_featured', 'is_available', 'order'
        ]


class RoomDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    gallery_images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'short_description', 'full_description', 'price_per_night', 'tax_percentage',
            'capacity', 'bed_type', 'size_sqft', 'view', 'primary_image',
            'amenities', 'gallery_images', 'is_featured', 'is_available', 'order',
            'created_at', 'updated_at'
        ]


class RoomWriteSerializer(serializers.ModelSerializer):
    amenity_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Amenity.objects.all(), source='amenities', required=False
    )

    class Meta:
        model = Room
        fields = [
            'id', 'title', 'slug', 'category', 'short_description', 'full_description',
            'price_per_night', 'tax_percentage', 'capacity', 'bed_type', 'size_sqft',
            'view', 'primary_image', 'amenity_ids', 'is_featured', 'is_available', 'order'
        ]


class BookingInquirySerializer(serializers.ModelSerializer):
    room_title = serializers.CharField(source='room.title', read_only=True)
    room_slug = serializers.CharField(source='room.slug', read_only=True)

    class Meta:
        model = BookingInquiry
        fields = [
            'id', 'room', 'room_title', 'room_slug', 'room_name_snapshot',
            'guest_name', 'guest_email', 'guest_phone',
            'check_in', 'check_out', 'num_guests', 'num_rooms',
            'total_nights', 'price_per_night_snapshot', 'estimated_subtotal',
            'estimated_tax', 'estimated_total', 'special_requests',
            'status', 'staff_notes', 'is_demo', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'room_name_snapshot', 'total_nights', 'price_per_night_snapshot',
            'estimated_subtotal', 'estimated_tax', 'estimated_total', 'is_demo',
            'created_at', 'updated_at'
        ]

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError({"check_out": "Check-out date must be strictly after the check-in date."})
        return data


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'


class SpecialOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialOffer
        fields = '__all__'


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = '__all__'
        read_only_fields = ['is_resolved', 'created_at']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
        read_only_fields = ['subscribed_at']
