import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { EventCreationService } from '../event-creation.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-event-creation-modal',
  templateUrl: './event-creation-modal.component.html',
  styleUrls: ['./event-creation-modal.component.css']
})
export class EventCreationModalComponent {
  eventForm!: FormGroup;
  createdEventSubject$: BehaviorSubject<CalendarEvent | undefined>;

  constructor(
    private eventCreationService: EventCreationService,
    formBuilder: FormBuilder,
  ) {

    this.createdEventSubject$ = this.eventCreationService.getSubject()

    this.createdEventSubject$.subscribe((event: CalendarEvent | undefined) => {
      this.eventForm = formBuilder.group({
        title: [event?.name, Validators.required],
        description: [event?.description, Validators.required],
        event_start_datetime: [event?.startDateTime.toISOString().substring(0, 16), Validators.required],
        event_end_datetime: [event?.endDateTime.toISOString().substring(0, 16), Validators.required],
      });
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

      this.eventCreationService.finalizeCreating(newEvent);
    } else {
      console.warn("Invalid form submit try")
    }
  }
}
