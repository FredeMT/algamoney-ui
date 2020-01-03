import { InputMaskModule } from 'primeng/inputmask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../shared/shared.module';
import { PessoasRoutingModule } from './pessoas-routing.module';



@NgModule({
  declarations: [
    PessoasPesquisaComponent,
    PessoaCadastroComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,

    PessoasRoutingModule,
    SharedModule
  ]
})
export class PessoasModule { }
