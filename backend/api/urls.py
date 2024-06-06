from django.urls import path
from . import views

urlpatterns = [
    path("tree-nodes/", views.TreeNodeListView.as_view(), name="tree-node-list"),
    path("events/", views.EventListView.as_view(), name="event-list"),
    path("events/create/", views.EventCreateView.as_view(), name="event-create"),
    path(
        "events/<int:pk>/update/", views.EventUpdateView.as_view(), name="event-update"
    ),
    path(
        "events/<int:pk>/delete/", views.EventDeleteView.as_view(), name="event-delete"
    ),
    path("tasks/", views.TaskListView.as_view(), name="task-list"),
    path("projects/", views.ProjectListView.as_view(), name="project-list"),
    path("groups/", views.GroupListView.as_view(), name="group-list"),
]
