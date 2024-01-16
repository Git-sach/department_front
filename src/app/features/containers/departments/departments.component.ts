import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgDepartmentsComponent } from '../../components/svg-departments/svg-departments.component';
import { DepartmentsFacadeService } from '../../facade/departments-facade.service';
import { Observable, combineLatest, map } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { ListDepartmentsComponent } from '../../components/list-departments/list-departments.component';
import { DetailsDepartmentComponent } from '../../components/details-department/details-department.component';
import { TemperatureDepartmentsService } from 'src/app/shared/services/api/temperature-departments.service';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, SvgDepartmentsComponent, ListDepartmentsComponent, DetailsDepartmentComponent],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent implements OnInit {

  departments$: Observable<Department[]>;
  selectedDepartment$: Observable<Department | null>;

  departmentTemperatures$: Observable<TemperatureDepartment[]>;
  selectedDepartmentTemperature$: Observable<TemperatureDepartment>;

  constructor(private departmentsFacade: DepartmentsFacadeService ,private temperatureDepartmentApi: TemperatureDepartmentsService) {
    this.departments$ = departmentsFacade.getDepartments$();
    this.selectedDepartment$ = departmentsFacade.getSelectedDepartment$();

    //provisoir pour le dev
    //TODO: refacto
    this.departmentTemperatures$ = this.temperatureDepartmentApi.getDepartmentsTemperatureForDate(new Date()).pipe(map(x => x.results));

    this.selectedDepartmentTemperature$ = combineLatest({
      departmentTemperatures: this.departmentTemperatures$,
      selectedDepartment: this.selectedDepartment$
    }).pipe(
      map(({ departmentTemperatures, selectedDepartment }) => {
        return departmentTemperatures.filter(TDepartment => TDepartment.code_insee_departement === selectedDepartment?.code)[0];
      })
    )
  }

  ngOnInit(): void {
    this.departmentsFacade.loadDepartments();
    //provisoir pour le dev
    this.departments$.subscribe(x => this.selectDepartment(x[0]));
  }

  selectDepartment(department: Department) {
    this.departmentsFacade.setSelectedDepartment(department);
  }
}
