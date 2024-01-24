import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { SvgDepartmentsComponent } from '../svg-departments/svg-departments.component';

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
    let viewBox = '0 0 0 0'
    if(this.department) {
      viewBox = `${this.department?.viewBox00} ${this.department?.viewBox01} ${this.department?.viewBox10} ${this.department?.viewBox11}`
    }
    return viewBox
  }
}
