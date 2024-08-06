from rest_framework import serializers

from .models import Calendar, Event, RecurrenceRule


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ["user", "uid", "name", "description", "dtstamp", "last_modified"]
        read_only_fields = ("user", "uid", "dtstamp", "last_modified")


class RecurrenceRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = ["frequency", "interval", "count", "until"]


class EventSerializer(serializers.ModelSerializer):
    rrule = RecurrenceRuleSerializer(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = [
            "calendar_id",
            "uid",
            "summary",
            "description",
            "dtstart",
            "dtend",
            "dtstamp",
            "last_modified",
            "rrule",
        ]
        read_only_fields = ("uid", "dtstamp", "last_modified")

    def create(self, validated_data):
        rrule_data = validated_data.pop("rrule", None)
        event = Event.objects.create(**validated_data)
        if rrule_data:
            RecurrenceRule.objects.create(event=event, **rrule_data)
        return event

    def update(self, instance, validated_data):
        rrule_data = validated_data.pop("rrule", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if rrule_data is not None:
            RecurrenceRule.objects.update_or_create(event=instance, defaults=rrule_data)
        else:
            if hasattr(instance, "rrule"):
                instance.rrule.delete()

        return instance
