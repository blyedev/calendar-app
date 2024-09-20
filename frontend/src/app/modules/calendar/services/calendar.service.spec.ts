import { TestBed } from '@angular/core/testing';

import { CalendarService } from './calendar.service';
import { CalendarAPIService } from 'src/app/core/services/calendar-api.service';
import { of } from 'rxjs/internal/observable/of';

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarAPIServiceMock: { getCalendars: jest.Mock };

  beforeEach(() => {
    calendarAPIServiceMock = {
      getCalendars: jest.fn().mockReturnValue(of([])),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: CalendarAPIService, useValue: calendarAPIServiceMock },
      ],
    });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
