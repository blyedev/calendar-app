import { TestBed } from '@angular/core/testing';
import { CalendarDataService } from './calendar-data.service';
import { CalendarAPIService } from 'src/app/core/services/calendar-api.service';
import { CalendarEventAPIService } from 'src/app/core/services/calendar-event-api.service';
import { of } from 'rxjs/internal/observable/of';

class MockCalendarAPIService {
  getCalendars() {
    return of([]);
  }
}

class MockCalendarEventAPIService {
  getEvents() {
    return of([]);
  }
}

describe('CalendarDataService', () => {
  let service: CalendarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarDataService,
        { provide: CalendarAPIService, useClass: MockCalendarAPIService },
        {
          provide: CalendarEventAPIService,
          useClass: MockCalendarEventAPIService,
        },
      ],
    });

    service = TestBed.inject(CalendarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
