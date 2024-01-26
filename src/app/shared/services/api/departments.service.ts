import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  readonly API = 'https://departmentsapi.adriencheynet.fr/departments';

  constructor(private http: HttpClient) {}

  //TODO: régler le problème CORS
  getAllDepartments(): Observable<any> {
    return this.http.get<any>(this.API);
  }
}
