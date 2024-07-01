from django.urls import path

from .views import (
    CalendarEventListCreateView,
    CalendarListCreateView,
    CalendarRetrieveUpdateDestroyView,
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
        "calendars/<uuid:calendar_pk>/events/",
        CalendarEventListCreateView.as_view(),
        name="calendar-event-list-create",
    ),
    path(
        "events/<uuid:pk>/",
        EventRetrieveUpdateDestroyView.as_view(),
        name="event-detail",
    ),
]
