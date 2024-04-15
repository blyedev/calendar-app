import { Component, HostListener, Input } from '@angular/core';
import { CalendarEvent } from 'src/app/core/models/calendar-event';
import { CalendarEventService } from 'src/app/core/services/calendar-event-service/calendar-event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input({ required: true }) event!: CalendarEvent;

  constructor(
    private calendarEventService: CalendarEventService) { }


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      // Handle the delete key press
      console.log('Delete key pressed inside the component.');

      // Call the deleteEvent method from your service
      this.calendarEventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          console.log('Event deleted successfully');
          this.calendarEventService.refreshEvents();
        },
        error: (error) => console.error('Error deleting event:', error),
        complete: () => {
          // Additional logic if needed
        }
      });
    }
  }
}
