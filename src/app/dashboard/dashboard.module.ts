import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [DashboardComponent],
  providers: [DecimalPipe],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,

    PanelModule,
    ChartModule
  ]
})
export class DashboardModule { }
