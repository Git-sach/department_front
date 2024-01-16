import { Injectable, inject } from '@angular/core';
import { DepartmentsService } from 'src/app/shared/services/api/departments.service';
import { DepartmentsStateService } from '../states/departments-state.service';
import { Department } from 'src/app/shared/interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsFacadeService {

  departmentApi = inject(DepartmentsService);
  departmentsStateService = inject(DepartmentsStateService);

  loadDepartments() {
    this.departmentApi.getAllDepartments()
      .subscribe(departments => this.departmentsStateService.setDepartments(departments));
  };

  getDepartments$() {
    return this.departmentsStateService.getDepartments$();
  };

  getSelectedDepartment$(){
    return this.departmentsStateService.getSelectedDepatment$();
  }

  setSelectedDepartment(department: Department) {
    this.departmentsStateService.setSelectedDepartment(department);
  }

}

