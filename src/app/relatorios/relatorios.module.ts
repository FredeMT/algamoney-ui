import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatorioLancamentosComponent } from './relatorio-lancamentos/relatorio-lancamentos.component';


@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    RelatoriosRoutingModule,

    FormsModule,
    CalendarModule
  ],
  declarations: [RelatorioLancamentosComponent],
})
export class RelatoriosModule { }
