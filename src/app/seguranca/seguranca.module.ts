import { MoneyHttpInterceptor } from './money-http-interceptor';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: ['http://localhost:8080/oauth/token']
      }
    })
  ],
  providers: [JwtHelperService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MoneyHttpInterceptor,
    multi: true
  }]
})
export class SegurancaModule { }
