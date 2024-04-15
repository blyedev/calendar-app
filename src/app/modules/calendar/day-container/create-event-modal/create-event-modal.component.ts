import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { CalendarEventService } from 'src/app/core/services/calendar-event-service/calendar-event.service';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.css']
})
export class CreateEventModalComponent implements OnInit {
  eventForm!: FormGroup;

  @Input({ required: true }) event!: CalendarEvent;

  constructor(
    private formBuilder: FormBuilder,
    private calendarEventService: CalendarEventService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: [this.event.name, Validators.required],
      description: [this.event.description, Validators.required],
      event_start_datetime: [this.event.startDateTime.toISOString().substring(0, 16), Validators.required],
      event_end_datetime: [this.event.endDateTime.toISOString().substring(0, 16), Validators.required],
    });
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation()
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const startDateTimeString = this.eventForm.value.event_start_datetime;
      const endDateTimeString = this.eventForm.value.event_end_datetime;

      const startDateTime = new Date(startDateTimeString);
      const endDateTime = new Date(endDateTimeString);

      // Get the time zone offset in minutes
      const startTimezoneOffset = startDateTime.getTimezoneOffset();
      const endTimezoneOffset = endDateTime.getTimezoneOffset();

      const newEvent: CalendarEvent = {
        id: 0,
        name: this.eventForm.value.title,
        description: this.eventForm.value.description,
        startDateTime: new Date(startDateTime.getTime() - startTimezoneOffset * 60000),
        endDateTime: new Date(endDateTime.getTime() - endTimezoneOffset * 60000)
      }
      this.calendarEventService.createEvent(newEvent).subscribe(createdEvent => {
        console.log('Created Event:', createdEvent);
        this.calendarEventService.refreshEvents();
      });
    } else {
      console.warn("Invalid form submit try")
    }
  }
}
