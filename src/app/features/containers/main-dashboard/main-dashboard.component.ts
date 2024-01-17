import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgDepartmentsComponent } from '../../components/svg-departments/svg-departments.component';
import { MainDashboardFacadeService } from '../../facade/main-dashboard-facade.service';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { ListDepartmentsComponent } from '../../components/list-departments/list-departments.component';
import { DetailsDepartmentComponent } from '../../components/details-department/details-department.component';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, SvgDepartmentsComponent, ListDepartmentsComponent, DetailsDepartmentComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  departments$: Observable<Department[]>;
  selectedDepartment$: Observable<Department | null>;

  departmentTemperatures$: Observable<TemperatureDepartment[]>;
  selectedDepartmentTemperature$: Observable<TemperatureDepartment>;

  loadTemperaturesSubscription?: Subscription;


  constructor(private mainDashboardFacade: MainDashboardFacadeService) {
    this.departments$ = mainDashboardFacade.getDepartments$();
    this.selectedDepartment$ = mainDashboardFacade.getSelectedDepartment$();

    this.departmentTemperatures$ = this.mainDashboardFacade.getTemperatureDepartmentsForSelectedDate$();
    this.selectedDepartmentTemperature$ = this.mainDashboardFacade.getSelectedDepartmentTemperatureForSelectedDate$();
  }

  //marche pas car cercle vissieux avec la date qui change avant que les température pour cette date ne soient chargés
  changeDateProvisoire() {
    this.selectDate(new Date('2018-02-01'));
  }

  ngOnInit(): void {
    this.mainDashboardFacade.loadDepartments();
    this.loadTemperaturesSubscription = this.mainDashboardFacade.loadTemperaturesForSelectedDateIfNotLoaded().subscribe();
    //provisoir pour le dev
    this.departments$.subscribe(x => this.selectDepartment(x[0]));
  }

  selectDepartment(department: Department) {
    this.mainDashboardFacade.setSelectedDepartment(department);
  }

  selectDate(date: Date): void {
    this.mainDashboardFacade.setSelectedDate(date);
  }

  ngOnDestroy(): void {
    this.loadTemperaturesSubscription?.unsubscribe();
  }
}
