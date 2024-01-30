import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemperatureDepartmentResponse } from '../../interfaces/temperatureDepartmentResponse';

@Injectable({
  providedIn: 'root',
})
export class TemperatureDepartmentsService {
  readonly API =
    'https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/temperature-quotidienne-departementale/records';

  private dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  constructor(private http: HttpClient) {}

  //TODO: Gérer le cas ou il n'y a pas de data pour la date
  getDepartmentsTemperatureForDate(
    date: Date
  ): Observable<TemperatureDepartmentResponse> {
    return this.http.get<TemperatureDepartmentResponse>(
      `${this.API}?where=date_obs=date'${this.dateFormaterString(
        date
      )}'&limit=96`
    );
  }

  getTemperaturesForDepartmentNumberAndDateInterval(
    departmentNumber: string,
    date1: Date,
    date2: Date
  ): Observable<TemperatureDepartmentResponse> {
    return this.http.get<TemperatureDepartmentResponse>(
      `${this.API}?where=date_obs>date'${this.dateFormaterString(
        date1
      )}' AND date_obs<date'${this.dateFormaterString(
        date2
      )}' AND code_insee_departement = '${departmentNumber}'&limit=100&order_by=date_obs DESC`
    );
  }

  private dateFormaterString(date: Date): string {
    return this.dateFormatter.format(date).split('/').reverse().join('-');
  }
}
