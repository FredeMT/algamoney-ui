import { Lancamento } from 'src/app/core/model';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { Content } from '@angular/compiler/src/render3/r3_ast';

/* interface/classe que estabelece um contrato de utilização de somente os parametros descritos aqui, pelos
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
     //   console.log(JSON.stringify(resultado));
        return resultado;
      });
  }

  excluir(codigo: number): Promise < void> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .set('Content-Type', 'application/json');
    // Formatar os tipos datas para o padrão dos dados json ('DD/MM/YYYY')
    let lanc = JSON.parse(JSON.stringify(lancamento));
    lanc.dataVencimento = (moment(lancamento.dataVencimento).format('DD/MM/YYYY'));
    lanc.dataPagamento = (moment(lancamento.dataPagamento).format('DD/MM/YYYY'));

    return this.http.post<Lancamento>(this.lancamentosUrl, lanc, { headers })
    .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .append('Content-Type', 'application/json');
    lancamento = this.converterDatasParaString(lancamento);
    console.log('lancamento atualizado: ', lancamento);
    return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento, { headers })
    .toPromise()
    .then(response => {
      const lancamentoAlterado = response.valueOf() as Lancamento;
      this.converterStringsParaDatas([lancamentoAlterado]);
      return lancamentoAlterado;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.get(`${this.lancamentosUrl}/${codigo}`, { headers })
    .toPromise()
    .then(response => {
      const lancamento = response.valueOf() as Lancamento;
      this.converterStringsParaDatas([lancamento]);
      return lancamento;
    });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento, 'DD/MM/YYYY').toDate();
      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento, 'DD/MM/YYYY').toDate();
      }
    }
  }

  // Formatar os tipos datas para o padrão dos dados json ('DD/MM/YYYY') da api
  private converterDatasParaString(lancamento: Lancamento) {
    const lancamentoString = JSON.parse(JSON.stringify(lancamento));
    lancamentoString.dataVencimento = moment(lancamento.dataVencimento).format('DD/MM/YYYY');
    lancamentoString.dataPagamento = moment(lancamento.dataPagamento).format('DD/MM/YYYY');
    return lancamentoString;
  }


}
