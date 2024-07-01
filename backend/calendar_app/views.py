from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

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
        user = self.request.user
        calendar_param = self.request.query_params.get("calendar")

        if calendar_param:
            try:
                # Split the parameter to get a list of UUIDs
                calendar_ids = calendar_param.split(",")
                calendars = Calendar.objects.filter(pk__in=calendar_ids, user=user)
                if not calendars.exists():
                    raise ValidationError("Invalid calendar UUID(s) provided.")
                return Event.objects.filter(calendar__in=calendars)
            except ValueError:
                raise ValidationError("Invalid UUID format provided.")
        return Event.objects.filter(calendar__user=user)


class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(calendar__user=self.request.user)
