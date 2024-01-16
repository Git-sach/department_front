import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemperatureDepartmentResponse } from '../../interfaces/temperatureDepartmentResponse';

@Injectable({
  providedIn: 'root'
})
export class TemperatureDepartmentsService {

  readonly API = 'https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/temperature-quotidienne-departementale/records';

  constructor(private http: HttpClient) {
  }

  getDepartmentsTemperatureForDate(date: Date): Observable<TemperatureDepartmentResponse> {
    return this.http.get<TemperatureDepartmentResponse>(`${this.API}?where=date_obs=date'2020-02-03'&limit=96`);
  }
}
