import { Component } from '@angular/core';
import { MainDashboardComponent } from './features/containers/main-dashboard/main-dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MainDashboardComponent],
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent {
  title = 'dep_temperatures';
}
