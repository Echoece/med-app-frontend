import { Component } from '@angular/core';
import { StatWidgetComponent } from './stat-widget/stat-widget.component';

@Component({
    selector: 'app-dashboardV2',
    imports: [StatWidgetComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
