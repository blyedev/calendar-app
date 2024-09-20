import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { CalendarEventAPIService } from 'src/app/core/services/calendar-event-api.service';
import { of } from 'rxjs/internal/observable/of';

describe('EventService', () => {
  let service: EventService;
  let eventAPIServiceMock: { getEvents: jest.Mock };

  beforeEach(() => {
    eventAPIServiceMock = {
      getEvents: jest.fn().mockReturnValue(of([])),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: CalendarEventAPIService, useValue: eventAPIServiceMock },
      ],
    });
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
