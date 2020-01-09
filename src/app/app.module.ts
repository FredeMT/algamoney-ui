import { CoreModule } from './core/core.module';
import { PessoasModule } from './pessoas/pessoas.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LancamentosModule } from './lancamentos/lancamentos.module';
import { AppRoutingModule } from './app-routing.module';
import { SegurancaModule } from './seguranca/seguranca.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    LancamentosModule,
    PessoasModule,
    CoreModule,
    SegurancaModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
