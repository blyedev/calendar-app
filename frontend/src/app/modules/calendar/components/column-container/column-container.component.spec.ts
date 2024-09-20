import { TestBed } from '@angular/core/testing';
import { ColumnContainerComponent } from './column-container.component';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from 'src/app/core/models/calendar.models';
import { signal } from '@angular/core';
import { EventCreationService } from '../../services/event-creation.service';

describe('ColumnContainerComponent', () => {
  let component: ColumnContainerComponent;
  let eventServiceMock: { events: ReturnType<typeof signal> };
  let eventCreationServiceMock: {};

  beforeEach(async () => {
    eventServiceMock = {
      events: signal<CalendarEvent[]>([]),
    };
    eventCreationServiceMock = {};

    await TestBed.configureTestingModule({
      imports: [ColumnContainerComponent],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: EventCreationService, useValue: eventCreationServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ColumnContainerComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('timespan', {
      start: new Date(),
      end: new Date(),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty list of positioned events by default', () => {
    expect(component.positionedEvents()).toEqual([]);
  });
});
