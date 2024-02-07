import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TemperatureDepartmentResponse } from '../../interfaces/temperatureDepartmentResponse';
import { DateFormater } from '../../utils/date-formater';

@Injectable({
  providedIn: 'root',
})
export class TemperatureDepartmentsService {
  readonly API =
    'https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/temperature-quotidienne-departementale/records';

  constructor(private http: HttpClient) {}

  //TODO: Gérer le cas ou il n'y a pas de data pour la date
  getDepartmentsTemperatureForDate(
    date: Date
  ): Observable<TemperatureDepartmentResponse> {
    return this.http
      .get<TemperatureDepartmentResponse>(
        `${this.API}?where=date_obs=date'${DateFormater.dateFormaterApiString(
          date
        )}'&limit=96`
      )
      .pipe(
        tap((x) =>
          x.results.forEach((x) => (x.date_obs = new Date(x.date_obs)))
        )
      );
  }

  getTemperaturesForDepartmentNumberAndDateInterval(
    departmentNumber: string,
    date1: Date,
    date2: Date
  ): Observable<TemperatureDepartmentResponse> {
    return this.http
      .get<TemperatureDepartmentResponse>(
        `${this.API}?where=date_obs>date'${DateFormater.dateFormaterApiString(
          date1
        )}' AND date_obs<date'${DateFormater.dateFormaterApiString(
          date2
        )}' AND code_insee_departement = '${departmentNumber}'&limit=100&order_by=date_obs DESC`
      )
      .pipe(
        tap((x) =>
          x.results.forEach((x) => (x.date_obs = new Date(x.date_obs)))
        )
      );
  }
}
