import { TestBed } from '@angular/core/testing';
import { RowContainerComponent } from './row-container.component';
import { signal } from '@angular/core'; // Import Angular's signal API
import { EventService } from '../../services/event.service';
import { CalendarEvent } from 'src/app/core/models/calendar.models';

describe('RowContainerComponent', () => {
  let component: RowContainerComponent;
  let eventServiceMock: { events: ReturnType<typeof signal> };

  beforeEach(async () => {
    eventServiceMock = {
      events: signal<CalendarEvent[]>([]),
    };

    await TestBed.configureTestingModule({
      imports: [RowContainerComponent],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(RowContainerComponent);
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
});
