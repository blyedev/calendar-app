import uuid

from django.conf import settings
from django.db import models


class Calendar(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True
    )

    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    dtstamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
