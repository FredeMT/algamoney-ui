import { LancamentoService } from './../lancamento.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { Lancamento } from 'src/app/core/model';
import { ToastyService } from 'ng2-toasty';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ];
  /*
    categorias = [
      { label: 'Alimentação', value: 1},
      { label: 'Transporte', value: 2}
    ];
  */
  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();
  titulo: string;
  /*
  pessoas = [
    { label: 'João da Silva', value: 4 },
    { label: 'Sebastião Souza', value: 2 },
    { label: 'Maria Abadia', value: 3 }
  ];
  */

  /* Injeta o service de categoria para listagem e errorHandler para tratar
  algum possível erro na chamada de categoriaService */
  constructor(private categoriaService: CategoriaService,
              private errorHandler: ErrorHandlerService,
              private pessoaService: PessoaService,
              private lancamentoService: LancamentoService,
              private toasty: ToastyService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
    const codigoLancamento = this.route.snapshot.params.codigo;
    // const codigoLancamento = this.route.snapshot.params['codigo'];
    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
    this.defineTitulo(codigoLancamento);

    this.title.setTitle(codigoLancamento ? 'Editar Lançamento' : 'Novo Lançamento');
  }

 // Verifica se lancamento.codigo tem um valor numérico, caso positivo é uma edição de Lançamento.
  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  defineTitulo(codigo: number) {
    if (codigo) {
      this.titulo = 'Editar Lançamento';
 } else {
      this.titulo = 'Novo Lançamento';
 }
}

carregarLancamento(codigo: number) {
  this.lancamentoService.buscarPorCodigo(codigo)
  .then(lancamento => {
    this.lancamento = lancamento;
    this.atualizarTituloEdicao();
  })
  .catch(erro => this.errorHandler.handle(erro));
}



  /*Como recebemos categorias no formato [nome:xxx, codigo:111], precisamos remapear para poder ser
  usado pelo componente do PrimeNG, para [label: xxx, value: 111], em then usaremos map para
   fazer esta conversão, que retornará um array com os elementos no novo formato. */
  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
       // console.log('CATEGORIAS', JSON.stringify(categorias));
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  /*
    salvar(form: FormControl) {
      console.log(this.lancamento);
      this.lancamentoService.adicionar(this.lancamento)
      .then(() => {
        this.toasty.success('Lancamento adicionado com sucesso!');
        form.reset();
       // this.lancamento = new Lancamento();
        setTimeout(function() {
          this.lancamento = new Lancamento();
        }.bind(this), 1);
      })
      .catch(erro => this.errorHandler.handle(erro));
    }
  */

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

 // salvar(form: FormControl) -  Cap. 18.8 mudou o nome do metodo para adicionar
  async adicionarLancamento(form: FormControl) {
    try {
     const lancamentoAdicionado = await  this.lancamentoService.adicionar(this.lancamento);
     this.toasty.success('Lancamento adicionado com sucesso!');
    //  form.reset({tipo: this.lancamento.tipo});
    //  this.lancamento = new Lancamento();
     this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
    } catch (erro) {
      return this.errorHandler.handle(erro);
    }
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      this.lancamento = lancamento;
      this.toasty.success('Lancamento alterado com sucesso!');
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

   novo(form: FormControl) {
    this.lancamento = new Lancamento();
    form.reset({tipo: this.lancamento.tipo});
    this.router.navigate([ '/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Editar Lançamento: ${this.lancamento.descricao}`);
  }


}
