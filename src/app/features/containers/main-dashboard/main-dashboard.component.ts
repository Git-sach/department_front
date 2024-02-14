import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { ChartLineComponent } from '../../components/chart-line/chart-line.component';
import { DetailsDepartmentComponent } from '../../components/details-department/details-department.component';
import { ListDepartmentsComponent } from '../../components/list-departments/list-departments.component';
import { SelectTemperatureTypeComponent } from '../../components/select-temperature-type/select-temperature-type.component';
import { SliderDateComponent } from '../../components/slider-date/slider-date.component';
import { SvgDepartmentsComponent } from '../../components/svg-departments/svg-departments.component';
import { MainDashboardFacadeService } from '../../facade/main-dashboard-facade.service';
import { TemperatureType } from '../../states/temperature-departments-state.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SvgDepartmentsComponent,
    ListDepartmentsComponent,
    DetailsDepartmentComponent,
    SliderDateComponent,
    ChartLineComponent,
    SelectTemperatureTypeComponent,
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDashboardComponent implements OnInit, OnDestroy {
  departments$: Observable<Department[]>;

  selectedDepartment$: Observable<Department | null>;

  selectedDate$: Observable<Date | null>;

  departmentTemperatures$: Observable<TemperatureDepartment[]>;

  selectedDepartmentTemperature$: Observable<TemperatureDepartment>;

  temperaturesForSelectedDepartmentOverThreeMonth$: Observable<
    TemperatureDepartment[]
  >;

  departmentsWichTemperatureMoy$: Observable<Department[]>;

  selectedTemperatureType$: Observable<TemperatureType>;

  loadTemperaturesSubscription?: Subscription;

  constructor(private mainDashboardFacade: MainDashboardFacadeService) {
    this.departments$ = mainDashboardFacade.getDepartments$();

    this.selectedDepartment$ = mainDashboardFacade.getSelectedDepartment$();

    this.departmentTemperatures$ =
      this.mainDashboardFacade.getTemperatureDepartmentsForSelectedDate$();

    this.selectedDepartmentTemperature$ =
      this.mainDashboardFacade.getSelectedDepartmentTemperatureForSelectedDate$();

    this.temperaturesForSelectedDepartmentOverThreeMonth$ =
      this.mainDashboardFacade.getTemperaturesForSelectedDepartmentAndSelectedDateOverThreeMonth$();

    this.departmentsWichTemperatureMoy$ =
      this.mainDashboardFacade.getDepartmentsWichTemperaturesForSelectedDate$();

    this.selectedDate$ = this.mainDashboardFacade.getSelectedDate$();

    this.selectedTemperatureType$ =
      this.mainDashboardFacade.getTemperatureType$();
  }

  ngOnInit(): void {
    this.mainDashboardFacade.loadDepartments();
    this.loadTemperaturesSubscription = this.mainDashboardFacade
      .loadTemperaturesForSelectedDateIfNotLoaded()
      .subscribe();
    //provisoir pour le dev
    this.departments$.subscribe((x) => this.selectDepartment(x[0]));
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

  selectTemperatureType(temperatureType: TemperatureType): void {
    this.mainDashboardFacade.setTemperatureType(temperatureType);
  }
}
