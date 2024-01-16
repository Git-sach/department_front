import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsStateService {

  private departments$ = new BehaviorSubject<Department[]>([]);
  private selectedDepatment$ = new BehaviorSubject<Department | null>(null);

  setDepartments(departments: Department[]): void {
    this.departments$.next(departments);
  };

  getDepartments$(): Observable<Department[]> {
    return this.departments$.asObservable();
  }

  getSelectedDepatment$(): Observable<Department | null> {
    return this.selectedDepatment$.asObservable();
  }

  setSelectedDepartment(department: Department): void {
    this.selectedDepatment$.next(department);
  }
}
