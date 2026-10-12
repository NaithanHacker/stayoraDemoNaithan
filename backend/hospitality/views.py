from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Q
from decimal import Decimal

from .models import (
    HotelSetting, Amenity, RoomCategory, Room, RoomImage,
    BookingInquiry, GalleryItem, SpecialOffer, ContactInquiry, NewsletterSubscriber
)
from .serializers import (
    HotelSettingSerializer, AmenitySerializer, RoomCategorySerializer,
    RoomListSerializer, RoomDetailSerializer, RoomWriteSerializer, RoomImageSerializer,
    BookingInquirySerializer, GalleryItemSerializer, SpecialOfferSerializer,
    ContactInquirySerializer, NewsletterSubscriberSerializer
)

class HotelSettingViewSet(viewsets.ModelViewSet):
    queryset = HotelSetting.objects.all()
    serializer_class = HotelSettingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        setting = HotelSetting.objects.first()
        if not setting:
            setting = HotelSetting.objects.create()
        serializer = self.get_serializer(setting)
        return Response(serializer.data)


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class RoomCategoryViewSet(viewsets.ModelViewSet):
    queryset = RoomCategory.objects.all()
    serializer_class = RoomCategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return RoomListSerializer
        elif self.action == 'retrieve':
            return RoomDetailSerializer
        return RoomWriteSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = Room.objects.all()
        # If not staff, only show available rooms
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_available=True)

        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(Q(category__slug=category) | Q(category__name__iexact=category))

        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')

        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price_per_night__gte=Decimal(min_price))
            except Exception:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price_per_night__lte=Decimal(max_price))
            except Exception:
                pass

        guests = self.request.query_params.get('guests')
        if guests:
            try:
                queryset = queryset.filter(capacity__gte=int(guests))
            except Exception:
                pass

        ordering = self.request.query_params.get('ordering')
        if ordering:
            if ordering in ['price_asc', 'price_per_night']:
                queryset = queryset.order_by('price_per_night')
            elif ordering in ['price_desc', '-price_per_night']:
                queryset = queryset.order_by('-price_per_night')
            elif ordering in ['capacity', '-capacity']:
                queryset = queryset.order_by(ordering)
            elif ordering == 'featured':
                queryset = queryset.order_by('-is_featured', 'order')

        return queryset


class BookingInquiryViewSet(viewsets.ModelViewSet):
    queryset = BookingInquiry.objects.all().order_by('-created_at')
    serializer_class = BookingInquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param and status_param.upper() != 'ALL':
            queryset = queryset.filter(status=status_param.upper())
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(guest_name__icontains=search) |
                Q(guest_email__icontains=search) |
                Q(guest_phone__icontains=search) |
                Q(room_name_snapshot__icontains=search)
            )
        return queryset


class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)
        return queryset


class SpecialOfferViewSet(viewsets.ModelViewSet):
    queryset = SpecialOffer.objects.all()
    serializer_class = SpecialOfferSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset


class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all().order_by('-created_at')
    serializer_class = ContactInquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all().order_by('-subscribed_at')
    serializer_class = NewsletterSubscriberSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# Staff Auth and Dashboard Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user or not user.is_staff:
        return Response({'detail': 'Invalid staff credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_me(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'is_staff': request.user.is_staff
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_metrics(request):
    total_inquiries = BookingInquiry.objects.count()
    pending = BookingInquiry.objects.filter(status='PENDING').count()
    contacted = BookingInquiry.objects.filter(status='CONTACTED').count()
    confirmed = BookingInquiry.objects.filter(status='CONFIRMED').count()
    cancelled = BookingInquiry.objects.filter(status='CANCELLED').count()

    total_pipeline = BookingInquiry.objects.exclude(status='CANCELLED').aggregate(
        total=Sum('estimated_total')
    )['total'] or Decimal('0.00')

    confirmed_pipeline = BookingInquiry.objects.filter(status='CONFIRMED').aggregate(
        total=Sum('estimated_total')
    )['total'] or Decimal('0.00')

    total_rooms = Room.objects.count()
    unread_messages = ContactInquiry.objects.filter(is_resolved=False).count()
    total_subscribers = NewsletterSubscriber.objects.count()

    return Response({
        'inquiries': {
            'total': total_inquiries,
            'pending': pending,
            'contacted': contacted,
            'confirmed': confirmed,
            'cancelled': cancelled
        },
        'revenue': {
            'total_pipeline': float(total_pipeline),
            'confirmed_pipeline': float(confirmed_pipeline)
        },
        'inventory': {
            'total_rooms': total_rooms,
            'unread_contacts': unread_messages,
            'subscribers': total_subscribers
        }
    })
