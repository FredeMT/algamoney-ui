import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
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
import { PessoaCadastroContatoComponent } from './pessoa-cadastro-contato/pessoa-cadastro-contato.component';



@NgModule({
  declarations: [
    PessoasPesquisaComponent,
    PessoaCadastroComponent,
    PessoaCadastroContatoComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,

    PanelModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    DropdownModule,

    PessoasRoutingModule,
    SharedModule
  ]
})
export class PessoasModule { }
