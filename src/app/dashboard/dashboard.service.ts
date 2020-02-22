import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Propriedade que indica a url do recurso utilizado.
  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
   }
   // Retorna uma promise, no formtato JSON, do tipo Array de any (Promise<Array<any>>).
   lancamentosPorCategoria(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
    .toPromise();
   }

   lancamentosPorDia(mesReferencia): Promise<Array<any>> {
    mesReferencia = moment(mesReferencia).format('YYYY-MM-DD'); // Transforma tipo date em tipo string.
    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-dia/${mesReferencia}`)
    .toPromise()
    .then(response => {
      const dados = response as Array<any>;
      this.converterStringsParaDatas(dados);
      return dados;
    });
   }

   // Converte a data recebida no formato string para o formato Date
   private converterStringsParaDatas(dados: Array<any>) {
     for (const dado of dados) {
       dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
     }
   }
}
