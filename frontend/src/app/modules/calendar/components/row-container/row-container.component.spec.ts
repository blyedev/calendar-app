import { TestBed } from '@angular/core/testing';
import { RowContainerComponent } from './row-container.component';
import { CalendarDataService } from '../../services/calendar-data.service';
import { of } from 'rxjs';

class MockCalendarDataService {
  events$ = of([]);
}

describe('RowContainerComponent', () => {
  let component: RowContainerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowContainerComponent],
      providers: [
        { provide: CalendarDataService, useClass: MockCalendarDataService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RowContainerComponent);
    component = fixture.componentInstance;

    // Set the required input property
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
