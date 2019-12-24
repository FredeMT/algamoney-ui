import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';

/* interface que estabelece um contrato de utilização de somente os parametros descritos aqui, pelos
componentes, logo se usar um diferente vai dar erro */
export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  // Propriedade que indica a url do recurso utilizado.
  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    let params = new HttpParams();

    // Paginação
    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    // add ao filtro o parametro descricao e seu valor dado em filtro.descricao
    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    /* add ao filtro o parametro dataVencimentoInicio e seu valor dado em filtro.dataVencimentoInicio
    no formato de string YYYY-MM-DD */
    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    /* add ao filtro o parametro dataVencimentoFim e seu valor dado em filtro.dataVencimentoFim
     no formato de string YYYY-MM-DD */
    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
      .toPromise()
      .then(response => {
        const lancamentos = response['content'];
        const resultado = {
          lancamentos,
          total: response['totalElements']
        };
        console.log(JSON.stringify(resultado));
        return resultado;
      });

  }
}
