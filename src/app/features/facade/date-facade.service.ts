import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DateSelectionStateService } from '../states/date-selection-state.service';

@Injectable({
  providedIn: 'root',
})
export class DateFacade {
  dateSelectionState = inject(DateSelectionStateService);

  /**
   * Obtient un Observable émettant la date sélectionnée.
   *
   * @returns Un Observable émettant la date sélectionnée.
   */
  getSelectedDate$(): Observable<Date> {
    return this.dateSelectionState.getSelectedDate$();
  }

  // DATE
  /**
   * Définit la date sélectionnée dans le state de la sélection de date.
   *
   * @param date La nouvelle date à définir comme date sélectionnée.
   */
  setSelectedDate(date: Date): void {
    this.dateSelectionState.setSelectedDate(date);
  }
}
