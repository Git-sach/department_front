import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsStateService {
  private departments$ = new BehaviorSubject<Department[]>([]);
  private selectedDepatment$ = new BehaviorSubject<Department | null>(null);

  setDepartments(departments: Department[]): void {
    this.departments$.next(departments);
  }

  getDepartments$(): Observable<Department[]> {
    return this.departments$.pipe(
      filter((departments) => departments.length > 0)
    );
  }

  getSelectedDepatment$(): Observable<Department | null> {
    return this.selectedDepatment$.asObservable();
  }

  setSelectedDepartment(department: Department): void {
    this.selectedDepatment$.next(department);
  }

  selectNextPreviousDeparment(direction: 'next' | 'previous') {
    const departments = this.departments$.value;
    // On fait comme cela car si on compar les Objets, ils ont changés et le références ne sont plsu les mêmes
    const selectedDepartment = departments.find((department) => {
      return this.selectedDepatment$.value?.code! === department.code;
    });
    const indexDepartment = departments.indexOf(selectedDepartment!);

    if (direction == 'next') {
      if (indexDepartment + 1 === departments.length) {
        this.setSelectedDepartment(departments[0]);
      } else {
        this.setSelectedDepartment(departments[indexDepartment + 1]);
      }
    } else {
      if (indexDepartment === 0) {
        this.setSelectedDepartment(departments[departments.length - 1]);
      } else {
        this.setSelectedDepartment(departments[indexDepartment - 1]);
      }
    }
  }
}
