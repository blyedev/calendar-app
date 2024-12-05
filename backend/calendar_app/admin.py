from django.contrib import admin

from .models import Calendar, Event, RecurrenceRule


class RecurrenceRuleInline(admin.StackedInline):
    model = RecurrenceRule
    can_delete = False
    verbose_name_plural = "Recurrence Rule"


class EventAdmin(admin.ModelAdmin):
    inlines = [RecurrenceRuleInline]
    list_display = ("summary", "calendar", "dtstart", "dtend")
    search_fields = ("summary", "description")


admin.site.register(Calendar)
admin.site.register(Event, EventAdmin)
