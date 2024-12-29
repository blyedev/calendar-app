import { TestBed } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { ComponentFixture } from '@angular/core/testing';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/calendar.models';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let eventServiceMock: { deleteEvent: jest.Mock };

  beforeEach(async () => {
    eventServiceMock = {
      deleteEvent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EventComponent],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
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

  it('should call deleteEvent on EventService when Delete key is pressed', () => {
    const deleteEventSpy = eventServiceMock.deleteEvent;

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    component.onKeyDown(event);

    expect(deleteEventSpy).toHaveBeenCalledWith('1');
  });
});
