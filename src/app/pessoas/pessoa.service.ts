import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../core/model';


export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  // Propriedade que indica a URI a ser utilizada
  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    let params = new HttpParams();

    // Paginação
    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());
    // add ao filtro o parametro descricao e seu valor dado em filtro.descricao
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}?`, { headers, params })
      .toPromise()
      .then(response => {
        const pessoas = response['content'];
        const resultado = {
          pessoas,
          total: response['totalElements']
        };
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.get(this.pessoasUrl, { headers })
      .toPromise()
      .then(response => response['content']);
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.delete(`${this.pessoasUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .set('Content-Type', 'application/json');
    console.log(JSON.stringify(`URI: ${this.pessoasUrl}/${codigo}/ativo,
     Situação: ${ativo}, Headers: ${headers}`));
    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .set('Content-Type', 'application/json');

    return this.http.post<Pessoa>(this.pessoasUrl, pessoa, { headers})
    .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .append('Content-Type', 'application/json');
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa, { headers })
    .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`, { headers})
    .toPromise();
  }

}
