import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { CalendarEvent } from '../calendar-event';

@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent {
  @Input() event!: CalendarEvent; // Assuming you pass the event object to the component using an input property

  constructor(private elementRef: ElementRef) {}

  @HostBinding('style.top.px')
  get topPosition(): number {
    const hours = this.event.startDateTime.getHours();
    return hours * 48;
  }

  @HostBinding('style.height.px')
  get eventHeight(): number {
    const startHour = this.event.startDateTime.getHours();
    const endHour = this.event.endDateTime.getHours();
    const height = (endHour - startHour) * 48;
    return height;
  }

  getCurrentBreakpoint(): string {
    const elementHeight = this.elementRef.nativeElement.offsetHeight;
    console.log(elementHeight);
    
    
    if (elementHeight < 100) {
      return 'small';
    } else if (elementHeight >= 100 && elementHeight < 150) {
      return 'medium';
    } else if (elementHeight >= 150) {
      return 'large';
    } else {
      return 'default';
    }
  }
  
}
