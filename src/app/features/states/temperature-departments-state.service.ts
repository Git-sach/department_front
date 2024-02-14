import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { TemperatureDepartmentsStorage } from 'src/app/shared/interfaces/temperatureDepartmentsStorage';
import { DateFormater } from 'src/app/shared/utils/date-formater';

export type TemperatureType = 'tmoy' | 'tmax' | 'tmin';

@Injectable({
  providedIn: 'root',
})
export class TemperatureDepartmentsStateService {
  private temperatureDepartments$ =
    new BehaviorSubject<TemperatureDepartmentsStorage>({});

  private temperatureType$: BehaviorSubject<TemperatureType> =
    new BehaviorSubject<TemperatureType>('tmax');

  /**
   * Obtient les départements de température pour une date spécifique.
   *
   * @param date La date pour laquelle récupérer les températures des départements.
   * @returns Un observable émettant un tableau de départements de température uniquement si l'observable contient des dates.
   */
  getTemperatureDepartmentsForDate$(
    date: Date
  ): Observable<TemperatureDepartment[]> {
    return this.temperatureDepartments$.pipe(
      filter(
        (temperatureDepartments) =>
          Object.keys(temperatureDepartments).length > 0
      ),
      map(
        (temperatureDepartments) =>
          temperatureDepartments[DateFormater.dateFormatedString(date)]
      )
    );
  }

  addTemperatureDepartmentForDate(
    date: Date,
    temperatureDepartments: TemperatureDepartment[]
  ) {
    const currentValue = this.temperatureDepartments$.getValue();
    this.temperatureDepartments$.next({
      ...currentValue,
      [DateFormater.dateFormatedString(date)]: temperatureDepartments,
    });
  }

  getDatesOfLoadedTemperaturesDepartments$(): Observable<string[]> {
    return this.temperatureDepartments$.pipe(
      map((temperatureDepartments) => Object.keys(temperatureDepartments))
    );
  }

  getTemperatureType$(): Observable<TemperatureType> {
    return this.temperatureType$.asObservable();
  }

  setTemperatureType(temperatureType: TemperatureType) {
    this.temperatureType$.next(temperatureType);
  }
}
