import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, filter, map, switchMap } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { DateFormater } from 'src/app/shared/utils/date-formater';
import { DateFacade } from './date-facade.service';
import { DepartmentsFacade } from './departments-facade.service';
import { TemperatureFacade } from './temperature-facade.service';

@Injectable({
  providedIn: 'root',
})
export class MainDashboardFacadeService {
  departmentsFacade = inject(DepartmentsFacade);
  temperatureFacade = inject(TemperatureFacade);
  dateFacade = inject(DateFacade);

  // DEPARTMENTS -----------------------------------------------------

  loadDepartments(): void {
    this.departmentsFacade.loadDepartments();
  }

  getDepartments$(): Observable<Department[]> {
    return this.departmentsFacade.getDepartments$();
  }

  getSelectedDepartment$(): Observable<Department | null> {
    return this.departmentsFacade.getSelectedDepartment$();
  }

  setSelectedDepartment(department: Department): void {
    this.departmentsFacade.setSelectedDepartment(department);
  }

  // TEMPERATURE -----------------------------------------------------

  loadTemperaturesForDate(date: Date): void {
    this.temperatureFacade.loadTemperaturesForDate(date);
  }

  // DATE ------------------------------------------------------------

  getSelectedDate$(): Observable<Date> {
    return this.dateFacade.getSelectedDate$();
  }

  setSelectedDate(date: Date): void {
    this.dateFacade.setSelectedDate(date);
  }

  // Mixte -----------------------------------------------------------

  /**
   * Obtient un Observable qui effectue un appel à l'API lorsque la date change,
   * uniquement si les températures correspondantes ne sont pas déjà stockées dans le store.
   *
   * @returns Un Observable
   */
  loadTemperaturesForSelectedDateIfNotLoaded(): Observable<void> {
    const date$ = this.getSelectedDate$();
    const loadedDates$ =
      this.temperatureFacade.getDatesOfLoadedTemperaturesDepartments$();

    return combineLatest([date$, loadedDates$]).pipe(
      map(([date, loadedDates]) => {
        if (!loadedDates.includes(DateFormater.dateFormatedString(date))) {
          return this.loadTemperaturesForDate(date);
        }
      })
    );
  }

  getTemperaturesForSelectedDepartmentAndSelectedDateOverThreeMonth$(): Observable<
    TemperatureDepartment[]
  > {
    const selectedDate$ = this.getSelectedDate$();
    const department$ = this.getSelectedDepartment$();

    return selectedDate$.pipe(
      switchMap((date) => {
        // 1,5 mois ->   45,6 jours -> 1 094,4 h -> 65 664 min -> 3 939 840 s -> 3 939 840 000 ms
        const offsetDate = 3939840000;
        const dateMin = new Date(date.getTime() - offsetDate);
        const dateMax = new Date(date.getTime() + offsetDate);

        return department$.pipe(
          filter((department) => department !== null),
          switchMap((department) => {
            return this.temperatureFacade.getTemperaturesForDepartmentNumberAndDateInterval(
              department!.code,
              dateMin,
              dateMax
            );
          })
        );
      })
    );
  }

  /**
   * Obtient un Observable émettant les températures pour tous les départements, à la date sélectionnée.
   *
   * @returns Un Observable émettant un tableau de températures pour la date selectionnée.
   */
  getTemperatureDepartmentsForSelectedDate$(): Observable<
    TemperatureDepartment[]
  > {
    return this.getSelectedDate$().pipe(
      switchMap((date) => {
        return this.temperatureFacade.getTemperatureDepartmentsForDate$(date);
      }),
      filter((temperatureDepartments) => temperatureDepartments !== undefined)
    );
  }

  /**
   * Obtient un Observable émettant les températures pour le département sélectionné, à la date sélectionnée.
   *
   * @returns Un Observable émettant les températures pour le département sélectionné à la date selectionnée.
   */
  getSelectedDepartmentTemperatureForSelectedDate$(): Observable<TemperatureDepartment> {
    const temperatures$ = this.getTemperatureDepartmentsForSelectedDate$();
    const department$ = this.getSelectedDepartment$();

    return combineLatest([temperatures$, department$]).pipe(
      map(([temperatures, department]) => {
        return temperatures.find(
          (TDepartment) =>
            TDepartment.code_insee_departement === department?.code
        )!;
      })
    );
  }

  /**
   * Obtient un Observable de departements avec les températures moyennes pour la date sélectionnée.
   * Combinant les informations des départements et des températures moy
   *
   * @returns Un observable émettant la liste des départements avec les températures moyennes.
   */
  getDepartmentsWichTemperatureMoyForSelectedDate$(): Observable<Department[]> {
    const departments$ = this.getDepartments$();
    const temperatures$ = this.getTemperatureDepartmentsForSelectedDate$();

    return combineLatest([departments$, temperatures$]).pipe(
      map(([departments, temperatures]) => {
        let departmentsCopy: Department[] = JSON.parse(
          JSON.stringify(departments)
        );

        departmentsCopy.map((department) => {
          const temperatureDepartment = temperatures.find(
            (temperatureDepartment) =>
              temperatureDepartment.code_insee_departement === department.code
          );
          department.tMoy = temperatureDepartment!.tmoy;
        });
        return departmentsCopy;
      })
    );
  }
}
