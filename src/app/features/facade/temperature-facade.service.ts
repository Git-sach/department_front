import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { TemperatureDepartmentsService } from 'src/app/shared/services/api/temperature-departments.service';
import {
  TemperatureDepartmentsStateService,
  TemperatureType,
} from '../states/temperature-departments-state.service';

@Injectable({
  providedIn: 'root',
})
export class TemperatureFacade {
  temperatureDepartmentsApi = inject(TemperatureDepartmentsService);
  temperatureDepartmentsState = inject(TemperatureDepartmentsStateService);

  /**
   * Charge les températures pour une date en faisant appel à l'API.
   * Les résultats obtenus sont ensuite ajoutés au state.
   *
   * @param date La date pour laquelle charger les températures.
   */
  loadTemperaturesForDate(date: Date): void {
    this.temperatureDepartmentsApi
      .getDepartmentsTemperatureForDate(date)
      .subscribe((temperatureDepartments) => {
        this.temperatureDepartmentsState.addTemperatureDepartmentForDate(
          date,
          temperatureDepartments.results
        );
      });
  }

  getTemperaturesForDepartmentNumberAndDateInterval(
    departmentNumber: string,
    date1: Date,
    date2: Date
  ): Observable<TemperatureDepartment[]> {
    return this.temperatureDepartmentsApi
      .getTemperaturesForDepartmentNumberAndDateInterval(
        departmentNumber,
        date1,
        date2
      )
      .pipe(map((x) => x.results));
  }

  getDatesOfLoadedTemperaturesDepartments$() {
    return this.temperatureDepartmentsState.getDatesOfLoadedTemperaturesDepartments$();
  }

  getTemperatureDepartmentsForDate$(
    date: Date
  ): Observable<TemperatureDepartment[]> {
    return this.temperatureDepartmentsState.getTemperatureDepartmentsForDate$(
      date
    );
  }

  getTemperatureType$(): Observable<TemperatureType> {
    return this.temperatureDepartmentsState.getTemperatureType$();
  }

  setTemperatureType(temperatureType: TemperatureType) {
    this.temperatureDepartmentsState.setTemperatureType(temperatureType);
  }
}
