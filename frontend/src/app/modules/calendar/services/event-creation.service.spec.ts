import { TestBed } from '@angular/core/testing';
import { EventCreationService } from './event-creation.service';
import { EventService } from './event.service';
import { CalendarService } from './calendar.service';

describe('EventCreationService', () => {
  let service: EventCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EventService, useValue: {} },
        { provide: CalendarService, useValue: { calendars: () => [] } },
      ],
    });
    service = TestBed.inject(EventCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
