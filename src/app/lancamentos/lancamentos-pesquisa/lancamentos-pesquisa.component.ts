import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { Table } from 'primeng/table' ;
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
})

export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  lancamentos = [];
  filtro = new LancamentoFiltro();
  @ViewChild('tabela', { static: true }) grid: Table;
  loading = false;

  constructor(private lancementoService: LancamentoService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              public auth: AuthService) { }

  ngOnInit() {
    // this.pesquisar();
    this.title.setTitle('Pesquisa de Lançamentos');
  }

  pesquisar(pagina = 0) {
    // Chama o service pesquisar com os valores e parametros do filtro instanciado.
    this.filtro.pagina = pagina;
    this.lancementoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
        if (pagina === 0) {
          this.grid.first = 0;
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancementoService.excluir(lancamento.codigo)
      .then(() => {
        console.log('Excluído.');
        this.grid.reset(); // Reseta a tabela para a primeira página
        this.messageService.add({severity: 'success', detail: 'Lançamento excluído com sucesso!'});
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
