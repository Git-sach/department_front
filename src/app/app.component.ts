import { Component } from '@angular/core';
import { DepartmentsComponent } from './features/containers/departments/departments.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DepartmentsComponent],
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent {
  title = 'dep_temperatures';
}
