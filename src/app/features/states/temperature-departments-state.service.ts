import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, tap } from 'rxjs';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { TemperatureDepartmentsStorage } from 'src/app/shared/interfaces/temperatureDepartmentsStorage';

@Injectable({
  providedIn: 'root'
})
export class TemperatureDepartmentsStateService {

  private temperatureDepartments$ = new BehaviorSubject<TemperatureDepartmentsStorage>({});

  /**
   * Obtient les départements de température pour une date spécifique.
   *
   * @param date La date pour laquelle récupérer les températures des départements.
   * @returns Un observable émettant un tableau de départements de température uniquement si l'observable contient des dates.
   */
  getTemperatureDepartmentsForDate$(date: Date): Observable<TemperatureDepartment[]> {
    return this.temperatureDepartments$.pipe(
      filter(temperatureDepartments => Object.keys(temperatureDepartments).length > 0),
      map(temperatureDepartments => temperatureDepartments[this.getDateFormatted(date)])
    );
  }

  addTemperatureDepartmentForDate(date: Date, temperatureDepartments: TemperatureDepartment[]) {
    const currentValue = this.temperatureDepartments$.getValue();
    this.temperatureDepartments$.next({ ...currentValue, [this.getDateFormatted(date)]: temperatureDepartments });
  }

  getDatesOfLoadedTemperaturesDepartments$(): Observable<string[]> {
    return this.temperatureDepartments$.pipe(
      map(temperatureDepartments => Object.keys(temperatureDepartments))
    )
  }

  getDateFormatted(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

}
