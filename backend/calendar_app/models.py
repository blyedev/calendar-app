from django.db import models


class Event(models.Model):
    description = models.TextField()
    title = models.CharField(max_length=255)
    event_start_datetime = models.DateTimeField()
    event_end_datetime = models.DateTimeField()

    def __str__(self):
        return self.title
