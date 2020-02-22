import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CoreModule } from './../core/core.module';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: CoreModule
})
export class RelatoriosService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
   }

   relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
     const params = new HttpParams()
     .append('inicio', moment(inicio).format('YYYY-MM-DD'))
     .append('fim', moment(fim).format('YYYY-MM-DD'));
     return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`,
     { params, responseType: 'blob'})
     .toPromise();
   }
}
