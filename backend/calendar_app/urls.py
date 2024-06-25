from django.urls import path
from . import views

urlpatterns = [
    path("events/", views.EventListView.as_view(), name="event-list"),
    path("events/create/", views.EventCreateView.as_view(), name="event-create"),
    path(
        "events/<int:pk>/update/", views.EventUpdateView.as_view(), name="event-update"
    ),
    path(
        "events/<int:pk>/delete/", views.EventDeleteView.as_view(), name="event-delete"
    ),
]
