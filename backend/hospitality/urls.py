from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HotelSettingViewSet, AmenityViewSet, RoomCategoryViewSet, RoomViewSet,
    BookingInquiryViewSet, GalleryItemViewSet, SpecialOfferViewSet,
    ContactInquiryViewSet, NewsletterSubscriberViewSet,
    admin_login, admin_me, admin_metrics
)

router = DefaultRouter()
router.register(r'settings', HotelSettingViewSet, basename='hotel-settings')
router.register(r'amenities', AmenityViewSet, basename='amenities')
router.register(r'categories', RoomCategoryViewSet, basename='room-categories')
router.register(r'rooms', RoomViewSet, basename='rooms')
router.register(r'bookings', BookingInquiryViewSet, basename='bookings')
router.register(r'gallery', GalleryItemViewSet, basename='gallery')
router.register(r'offers', SpecialOfferViewSet, basename='offers')
router.register(r'contact', ContactInquiryViewSet, basename='contact')
router.register(r'newsletter', NewsletterSubscriberViewSet, basename='newsletter')

urlpatterns = [
    # Auth & Admin endpoints
    path('auth/login/', admin_login, name='admin-login'),
    path('auth/me/', admin_me, name='admin-me'),
    path('admin/metrics/', admin_metrics, name='admin-metrics'),

    # Resource routers
    path('', include(router.urls)),
]
