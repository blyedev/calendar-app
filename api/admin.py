from django.contrib import admin

from .models import Event, Group, Project, Task

# Register your models here.

admin.site.register(Event)
admin.site.register(Task)
admin.site.register(Project)
admin.site.register(Group)
