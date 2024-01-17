import { Injectable, inject } from '@angular/core';
import { DepartmentsService } from 'src/app/shared/services/api/departments.service';
import { DepartmentsStateService } from '../states/departments-state.service';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { TemperatureDepartmentsService } from 'src/app/shared/services/api/temperature-departments.service';
import { TemperatureDepartmentsStateService } from '../states/temperature-departments-state.service';
import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { DateSelectionStateService } from '../states/date-selection-state.service';

@Injectable({
  providedIn: 'root'
})
export class MainDashboardFacadeService {
  //TODO: Faire deux classes distincles et faire hériter cette classe des deux autres ??

  departmentApi = inject(DepartmentsService);
  departmentsState = inject(DepartmentsStateService);

  temperatureDepartmentsApi = inject(TemperatureDepartmentsService);
  temperatureDepartmentsState = inject(TemperatureDepartmentsStateService);

  dateSelectionState = inject(DateSelectionStateService);

  /**
   * Charge la liste complète des départements depuis l'API et met à jour le state des départements.
   */
  loadDepartments(): void {
    this.departmentApi.getAllDepartments()
      .subscribe(departments => this.departmentsState.setDepartments(departments));
  };

  /**
   * Obtient un Observable émettant le département actuellement sélectionné.
   *
   * @returns Un Observable émettant le département sélectionné.
   */
  getDepartments$(): Observable<Department[]> {
    return this.departmentsState.getDepartments$();
  };

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

  /**
   * Obtient un Observable qui effectue un appel à l'API lorsque la date change,
   * uniquement si les températures correspondantes ne sont pas déjà stockées dans le store.
   *
   * @returns Un Observable
   */
  loadTemperaturesForSelectedDateIfNotLoaded(): Observable<void> {
    return combineLatest({
      selectedDate: this.getSelectedDate$(),
      dateOfTemperaturesLoaded: this.temperatureDepartmentsState.getDatesOfLoadedTemperaturesDepartments$()
    }).pipe(
      map(({ selectedDate, dateOfTemperaturesLoaded }) => {
        if (!dateOfTemperaturesLoaded.includes(this.temperatureDepartmentsState.getDateFormatted(selectedDate))) {
          return this.loadTemperaturesForSelectedDate(selectedDate);
        }
      })
    )
  }

  /**
   * Charge les températures pour la date sélectionnée en faisant appel à l'API.
   * Les résultats obtenus sont ensuite ajoutés au state.
   *
   * @param date La date pour laquelle charger les températures.
   */
  loadTemperaturesForSelectedDate(date: Date): void {
    this.temperatureDepartmentsApi.getDepartmentsTemperatureForDate(date)
      .subscribe(temperatureDepartments => {
        this.temperatureDepartmentsState.addTemperatureDepartmentForDate(date, temperatureDepartments.results)
      })
  }

  /**
   * Obtient un Observable émettant les températures pour tous les départements, à la date sélectionnée.
   *
   * @returns Un Observable émettant un tableau de températures pour la date selectionnée.
   */
  getTemperatureDepartmentsForSelectedDate$(): Observable<TemperatureDepartment[]> {
    return this.getSelectedDate$().pipe(switchMap(date => {
      return this.temperatureDepartmentsState.getTemperatureDepartmentsForDate$(date);
    }))
  }

  /**
   * Obtient un Observable émettant les températures pour le département sélectionné, à la date sélectionnée.
   *
   * @returns Un Observable émettant les températures pour le département sélectionné à la date selectionnée.
   */
  getSelectedDepartmentTemperatureForSelectedDate$(): Observable<TemperatureDepartment> {
    return combineLatest({
      departmentTemperatures: this.getTemperatureDepartmentsForSelectedDate$(),
      selectedDepartment: this.getSelectedDepartment$()
    }).pipe(
      filter(x => x.departmentTemperatures !== undefined),
      map(({ departmentTemperatures, selectedDepartment }) => {
        return departmentTemperatures.filter(TDepartment => TDepartment.code_insee_departement === selectedDepartment?.code)[0];
      })
    )
  }

  /**
   * Obtient un Observable émettant la date sélectionnée.
   *
   * @returns Un Observable émettant la date sélectionnée.
   */
  getSelectedDate$(): Observable<Date> {
    return this.dateSelectionState.getSelectedDate$();
  }

  /**
   * Définit la date sélectionnée dans le state de la sélection de date.
   *
   * @param date La nouvelle date à définir comme date sélectionnée.
   */
  setSelectedDate(date: Date): void {
    this.dateSelectionState.setSelectedDate(date);
  }
}

