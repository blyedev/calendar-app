from django.urls import path

from .views import (
    CalendarListCreateView,
    CalendarRetrieveUpdateDestroyView,
    EventListCreateView,
    EventRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("calendars/", CalendarListCreateView.as_view(), name="calendar-list-create"),
    path(
        "calendars/<uuid:pk>/",
        CalendarRetrieveUpdateDestroyView.as_view(),
        name="calendar-detail",
    ),
    path(
        "events/",
        EventListCreateView.as_view(),
        name="event-list-create",
    ),
    path(
        "events/<uuid:pk>/",
        EventRetrieveUpdateDestroyView.as_view(),
        name="event-detail",
    ),
]
