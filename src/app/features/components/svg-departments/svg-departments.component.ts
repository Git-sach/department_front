import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { Color } from 'src/app/shared/valueObjects/color';

@Component({
  selector: 'app-svg-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-departments.component.html',
  styleUrls: ['./svg-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgDepartmentsComponent {
  @Input({ required: true }) departments: Department[] | null = [];
  @Input({ required: true }) selectedDepartment: Department | null = null;
  @Input({ required: true })
  set temperatures(temperatures: TemperatureDepartment[] | null) {
    if (temperatures) {
      const tMax = this.getTemperatureMaxOfDepartments(temperatures);
      const tMin = this.getTemperatureMinOfDepartments(temperatures);

      temperatures.map((temperature) => {
        const indexOfGradientColor = this.findNumericValueOfAnalogData(
          temperature.tmoy,
          tMax,
          tMin,
          this.numberOfColorsInGradient
        );
        const color = `#${this.gradientOfColor[indexOfGradientColor].valueHexa}`;

        const department = this.departments?.find(
          (department) => department.code === temperature.code_insee_departement
        );

        department!.color = color;
      });
    }
  }
  @Output() departmentEmitter = new EventEmitter<Department>();

  private numberOfColorsInGradient = 200;
  private negativeColor = new Color('4F2206');
  private positiveColor = new Color('F76B15');
  private gradientOfColor = this.negativeColor.creatGradient(
    this.positiveColor,
    this.numberOfColorsInGradient
  );

  selectDepartment(department: Department) {
    this.departmentEmitter.emit(department);
  }

  getTemperatureMinOfDepartments(temperature: TemperatureDepartment[]): number {
    return temperature.reduce((acc, current) =>
      current.tmoy < acc.tmoy ? current : acc
    ).tmoy!;
  }

  getTemperatureMaxOfDepartments(temperature: TemperatureDepartment[]): number {
    return temperature.reduce((acc, current) =>
      current.tmoy > acc.tmoy ? current : acc
    ).tmoy!;
  }

  /**
   * Échantillonne une valeur analogique en fonction des valeurs minimale et maximale, produisant un résultat numérique.
   *
   * Cette méthode prend en compte une valeur analogique, la valeur maximale et minimale possibles,
   * ainsi que le nombre d'échantillons pour déterminer la position numérique échantillonnée.
   *
   * exemple:
   * valeur min 1.1
   * valeur max 8.9
   * nbr echantillonage 10
   *
   * Pour la valeur numérique 1.1 nous avons 0
   * Pour la valeur numérique 8.9 nous avons 9
   *
   * @param value La valeur analogique à échantillonner.
   * @param valueMax La valeur maximale possible dans la plage de valeurs analogiques.
   * @param valueMin La valeur minimale possible dans la plage de valeurs analogiques.
   * @param sampling Le nombre d'échantillons considérés pour l'échantillonnage.
   * @returns La position échantillonnée, exprimée en valeur numérique entière, comprise entre 0 et le nombre d'échantillons - 1.
   */
  findNumericValueOfAnalogData(
    value: number,
    valueMax: number,
    valueMin: number,
    sampling: number
  ): number {
    return Math.floor(
      (value - valueMin) * ((sampling - 1) / (valueMax - valueMin))
    );
  }
}
