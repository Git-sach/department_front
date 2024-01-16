import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { SvgDepartmentsComponent } from '../svg-departments/svg-departments.component';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';

@Component({
  selector: 'app-details-department',
  standalone: true,
  imports: [CommonModule, SvgDepartmentsComponent],
  templateUrl: './details-department.component.html',
  styleUrls: ['./details-department.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsDepartmentComponent {
  @Input({ required: true }) department: Department | null = null;
  @Input({ required: true }) temperature: TemperatureDepartment | null = null;

  public get vewbox() {
    return `${this.department?.viewBox00} ${this.department?.viewBox01} ${this.department?.viewBox10} ${this.department?.viewBox11}`
  }
}
