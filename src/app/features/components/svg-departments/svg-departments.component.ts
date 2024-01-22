import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { Color } from 'src/app/shared/valueObjects/color';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';

@Component({
  selector: 'app-svg-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-departments.component.html',
  styleUrls: ['./svg-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgDepartmentsComponent implements OnInit, OnChanges {
  @Input({ required: true }) departments: Department[] | null = [];
  @Input({ required: true }) selectedDepartment: Department | null = null;
  @Input({ required: true }) temperatures: TemperatureDepartment[] | null = null;
  @Output() departmentEmitter = new EventEmitter<Department>();

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const negativColor = new Color('4F2206');
    const positivColor = new Color('F76B15');
    // faire en sorte d'avoire le même nombre ici
    const numberOfColorGradient = 199;
    const gradientColor = negativColor.creatGradient(positivColor, numberOfColorGradient);

    // On attribut a toutes les temperature un chiffre rond entre 0 et numberOfColors
    // gros refacto a faire pas de OnChanges...
    const numberOfColors = 200
    if (this.temperatures !== null) {
      this.temperatures.map(temperature => {
        const color = `#${gradientColor[Math.floor((temperature.tmoy - this.getTemperatureMinDepartments()) * (numberOfColors / (this.getTemperatureMaxDepartments() - this.getTemperatureMinDepartments())))].valueHexa}`;
        const department = this.departments?.filter(department => {
          return department.code === temperature.code_insee_departement
        })[0];

        department!.color = color;
      })
    }
  }

  selectDepartment(department: Department) {
    this.departmentEmitter.emit(department);
  }

  getTemperatureMinDepartments(): number {
    return this.temperatures?.reduce((acc, current) => current.tmoy < acc.tmoy ? current : acc).tmoy!;
  }

  getTemperatureMaxDepartments(): number {
    return this.temperatures?.reduce((acc, current) => current.tmoy > acc.tmoy ? current : acc).tmoy!;
  }
}
