import { ErrorHandlerService } from './../../core/error-handler.service';
import { Pessoa, Contato } from './../../core/model';
import { PessoaService } from './../pessoa.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();
  titulo: string;

  constructor(private pessoaService: PessoaService,
              private toasty: ToastyService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params.codigo;
    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
    this.titulo = codigoPessoa ? 'Editar Pessoa' : 'Nova Pessoa';
    this.title.setTitle(codigoPessoa ? 'Editar Pessoa' : 'Nova Pessoa');
  }

  // Verifica se pessoa.codigo tem um valor numérico, caso positivo é uma edição de Lançamento.
  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa;
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  async adicionarPessoa(form: FormControl) {
    try {
     // this.pessoa.ativo = true;
      const pessoaAdicionada =  await this.pessoaService.adicionar(this.pessoa);
      this.toasty.success('Pessoa adicionada com sucesso!');
      // form.reset();
      // this.pessoa = new Pessoa();
      this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
    } catch (erro) {
      return this.errorHandler.handle(erro);
    }
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
    .then(pessoa => {
      this.pessoa = pessoa;
      this.toasty.success('Pessoa alterada com sucesso!');
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form) {
    this.pessoa = new Pessoa();
    form.reset();
    this.router.navigate(['/pessoas/nova']);
  }

}
