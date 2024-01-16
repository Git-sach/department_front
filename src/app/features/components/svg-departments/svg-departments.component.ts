import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from 'src/app/shared/interfaces/department.interface';

@Component({
  selector: 'app-svg-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-departments.component.html',
  styleUrls: ['./svg-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgDepartmentsComponent {
  @Input({required: true}) departments: Department[] | null = [];
  @Input({required: true}) selectedDepartment : Department | null = null;
  @Output() departmentEmitter = new EventEmitter<Department>();

  selectDepartment(department: Department) {
    this.departmentEmitter.emit(department);
  }
}
