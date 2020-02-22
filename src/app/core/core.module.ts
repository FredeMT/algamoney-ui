
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [NavbarComponent, PaginaNaoEncontradaComponent, NaoAutorizadoComponent],
  exports: [NavbarComponent, ToastModule,
    ConfirmDialogModule],
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService,
    MessageService,
    {provide: LOCALE_ID, useValue: 'pt-BR'}]
})
export class CoreModule { }
