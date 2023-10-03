import { Component, HostListener, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEventService } from '../calendar-event-service/calendar-event.service';

@Component({
  selector: 'app-new-event-form',
  templateUrl: './new-event-form.component.html',
  styleUrls: ['./new-event-form.component.css']
})
export class NewEventFormComponent {
  eventForm!: FormGroup;

  @Input() event!: {
    id: number,
    name: string,
    startDateTime: Date,
    endDateTime: Date
  };

  constructor(
    private formBuilder: FormBuilder,
    private calendarEventService: CalendarEventService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: [this.event.name, Validators.required],
      description: ['', Validators.required],
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
      const newEvent = {
        name: this.eventForm.value.title,
        startDateTime: new Date(this.eventForm.value.event_start_datetime),
        endDateTime: new Date(this.eventForm.value.event_end_datetime)
      }
      this.calendarEventService.createEvent(newEvent).subscribe(createdEvent => {
        // Optionally, handle the created event or update the local events array
        console.log('Created Event:', createdEvent);
      });
    } else {
      console.warn("Invalid form submit try")
    }
  }
}
