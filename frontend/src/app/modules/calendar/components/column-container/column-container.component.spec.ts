import { TestBed } from '@angular/core/testing';
import { ColumnContainerComponent } from './column-container.component';
import { Observable, of } from 'rxjs';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from 'src/app/core/models/calendar.models';

describe('ColumnContainerComponent', () => {
  let component: ColumnContainerComponent;
  let eventServiceMock: { events$: Observable<CalendarEvent[]> };

  beforeEach(async () => {
    eventServiceMock = {
      events$: of([]),
    };

    await TestBed.configureTestingModule({
      imports: [ColumnContainerComponent],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
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
