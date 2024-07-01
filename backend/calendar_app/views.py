from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Calendar, Event
from .serializers import CalendarSerializer, EventSerializer


class CalendarListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Calendar.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CalendarRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Calendar.objects.filter(user=self.request.user)


class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(calendar__user=self.request.user)

    def perform_create(self, serializer):
        calendar = Calendar.objects.get(pk=self.request.data["calendar"])
        if calendar.user != self.request.user:
            raise PermissionDenied(
                "You do not have permission to add an event to this calendar."
            )
        serializer.save(calendar=calendar)


class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(calendar__user=self.request.user)
