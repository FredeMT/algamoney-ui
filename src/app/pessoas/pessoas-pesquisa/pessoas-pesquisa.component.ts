import { AuthService } from './../../seguranca/auth.service';
import { Table } from 'primeng/table';
import { PessoaService } from './../pessoa.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { PessoaFiltro } from '../pessoa.service';
import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  pessoas = [];
  filtro = new PessoaFiltro();
  @ViewChild('tabela', { static: true }) grid: Table;

  constructor(private pessoaService: PessoaService,
              private toasty: ToastyService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              private auth: AuthService) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      } )
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        console.log('Excluído');
        this.grid.reset();
        this.toasty.success('Pessoa excluída com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.toasty.success(`Pessoa ${acao} com sucesso!`);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  private getEstilosAtivo(ativo: boolean) {
    return {
      color: 'white',
      textDecoration: 'none',
      backgroundColor: ativo ? '#5cb85c' : '#d9534f',
      padding: '2px 12px',
      textAlign: 'center',
      display: 'inline-block',
      borderRadius: '1em'
    };
  }
}


