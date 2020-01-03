import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from '../shared/shared.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';


import {DialogModule} from 'primeng/dialog';
import { LancamentosRoutingModule } from './ lancamentos-routing.module';


@NgModule({
  declarations: [ LancamentoCadastroComponent,
    LancamentosPesquisaComponent],
    exports: [],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    CurrencyMaskModule,
    LancamentosRoutingModule,

    SharedModule,
    ProgressSpinnerModule,
    DialogModule
  ]
})
export class LancamentosModule { }
