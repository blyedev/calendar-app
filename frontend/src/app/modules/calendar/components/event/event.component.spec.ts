import { TestBed } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { CalendarDataService } from '../../services/calendar-data.service';
import { ComponentFixture } from '@angular/core/testing';
import { CalendarEvent } from 'src/app/core/models/calendar.models';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let calendarDataServiceMock: { deleteEvent: jest.Mock };

  beforeEach(async () => {
    calendarDataServiceMock = {
      deleteEvent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EventComponent],
      providers: [
        { provide: CalendarDataService, useValue: calendarDataServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;

    const testEvent: CalendarEvent = {
      uid: '1',
      calendarUID: 'calendar-1',
      summary: 'Test Event',
      description: 'This is a test event',
      start: new Date(),
      end: new Date(),
      recurrenceRule: null,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    fixture.componentRef.setInput('event', testEvent);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteEvent on CalendarDataService when Delete key is pressed', () => {
    const deleteEventSpy = calendarDataServiceMock.deleteEvent;

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    component.onKeyDown(event);

    expect(deleteEventSpy).toHaveBeenCalledWith('1');
  });
});
