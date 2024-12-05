import uuid

from django.db import models


class Event(models.Model):
    calendar = models.ForeignKey("calendar", on_delete=models.CASCADE)
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)

    summary = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    dtstart = models.DateTimeField()
    dtend = models.DateTimeField()

    dtstamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.summary or str(self.uid)


class RecurrenceRule(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="rrule")
    frequency = models.CharField(
        max_length=50,
        choices=[
            ("DAILY", "Daily"),
            ("WEEKLY", "Weekly"),
            ("MONTHLY", "Monthly"),
            ("YEARLY", "Yearly"),
        ],
    )
    interval = models.IntegerField(null=True, blank=True)
    count = models.IntegerField(null=True, blank=True)
    until = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        parts = [f"FREQ={self.frequency}"]
        if self.interval:
            parts.append(f"INTERVAL={self.interval}")
        if self.count:
            parts.append(f"COUNT={self.count}")
        if self.until:
            parts.append(f"UNTIL={self.until.strftime('%Y%m%dT%H%M%SZ')}")
        return ";".join(parts)
