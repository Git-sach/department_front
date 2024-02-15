import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { DepartmentsService } from 'src/app/shared/services/api/departments.service';
import { DepartmentsStateService } from '../states/departments-state.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsFacade {
  departmentApi = inject(DepartmentsService);
  departmentsState = inject(DepartmentsStateService);

  /**
   * Charge la liste complète des départements depuis l'API et met à jour le state des départements.
   */
  loadDepartments(): void {
    this.departmentApi
      .getAllDepartments()
      .subscribe((departments) =>
        this.departmentsState.setDepartments(departments)
      );
  }

  /**
   * Obtient un Observable émettant le département actuellement sélectionné.
   *
   * @returns Un Observable émettant le département sélectionné.
   */
  getDepartments$(): Observable<Department[]> {
    return this.departmentsState.getDepartments$();
  }

  getSelectedDepartment$(): Observable<Department | null> {
    return this.departmentsState.getSelectedDepatment$();
  }

  /**
   * Définit le département sélectionné dans le store des départements.
   *
   * @param department Le nouveau département à définir comme département sélectionné.
   */
  setSelectedDepartment(department: Department): void {
    this.departmentsState.setSelectedDepartment(department);
  }

  selectNextPreviousDeparment(direction: 'next' | 'previous') {
    this.departmentsState.selectNextPreviousDeparment(direction);
  }
}
