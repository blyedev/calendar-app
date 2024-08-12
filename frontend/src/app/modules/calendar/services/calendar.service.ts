import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { Calendar } from 'src/app/core/models/calendar.models';
import { CalendarAPIService } from 'src/app/core/services/calendar-api.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private calendarsSubject: BehaviorSubject<Calendar[]>;

  private _calendars$: Observable<Calendar[]>;

  constructor(private calendarAPIService: CalendarAPIService) {
    this.calendarsSubject = new BehaviorSubject<Calendar[]>([]);

    this._calendars$ = this.calendarsSubject.asObservable();

    this.loadCalendars();
  }

  public get calendars$(): Observable<Calendar[]> {
    return this._calendars$;
  }

  loadCalendars(): void {
    this.calendarAPIService
      .getCalendars()
      .pipe(
        tap((calendars: Calendar[]) => this.calendarsSubject.next(calendars)),
      )
      .subscribe();
  }

  addCalendar(calendar: Calendar): void {
    this.calendarAPIService
      .addCalendar(calendar)
      .pipe(tap(() => this.loadCalendars()))
      .subscribe();
  }

  updateCalendar(calendar: Calendar): void {
    this.calendarAPIService
      .updateCalendar(calendar)
      .pipe(tap(() => this.loadCalendars()))
      .subscribe();
  }

  deleteCalendar(uid: string): void {
    this.calendarAPIService
      .deleteCalendar(uid)
      .pipe(tap(() => this.loadCalendars()))
      .subscribe();
  }
}
