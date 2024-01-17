import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateSelectionStateService {

  private selectedDate$ = new BehaviorSubject<Date>(new Date('01-02-2023'));

  getSelectedDate$(): Observable<Date> {
    return this.selectedDate$.asObservable();
  }

  setSelectedDate(date: Date):void {
    this.selectedDate$.next(new Date(date))
  }
}
