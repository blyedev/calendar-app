import { TestBed } from '@angular/core/testing';
import { ColumnContainerComponent } from './column-container.component';
import { CalendarDataService } from '../../services/calendar-data.service';
import { of } from 'rxjs';
import { Interval } from 'src/app/core/models/calendar.models';

class MockCalendarDataService {
  events$ = of([]);
}

describe('ColumnContainerComponent', () => {
  let component: ColumnContainerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnContainerComponent],
      providers: [
        { provide: CalendarDataService, useClass: MockCalendarDataService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ColumnContainerComponent);
    component = fixture.componentInstance;

    const testTimespan: Interval = { start: new Date(), end: new Date() };
    fixture.componentRef.setInput('timespan', testTimespan);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty list of positioned events by default', () => {
    expect(component.positionedEvents()).toEqual([]);
  });
});
