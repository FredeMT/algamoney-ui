import { LancamentoService } from './../lancamento.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { Lancamento } from 'src/app/core/model';
import { ToastyService } from 'ng2-toasty';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

  categorias = [];
  pessoas = [];
 // lancamento = new Lancamento();
  /* Propriedade que vai passar a receber os valores do service, tratar e enviar para o template
  substituindo o objdto lancamento. */
  formulario: FormGroup;
  titulo: string;

  /* Injeta o service de categoria para listagem e errorHandler para tratar
  algum possível erro na chamada de categoriaService */
  constructor(private categoriaService: CategoriaService,
              private errorHandler: ErrorHandlerService,
              private pessoaService: PessoaService,
              private lancamentoService: LancamentoService,
              private toasty: ToastyService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder) { } // Criador de instancias

  ngOnInit() {
    this.configurarFormulario();

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

  // Configura/Construtor de formulário - usa o FormBuilder - define as propriedades e funções
  configurarFormulario() {
    // Instancia um objeto do tipo formgroup com as seguintes propriedades e métodos
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      // Aqui add um conjunto de validadores [Validators.required, Validators.minLength(5)]
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      // Como pessoa e categoria são classes (tem propriedades) instanciamos como formGroup, com suas propriedades.
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : {obrigatoriedade: true});
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

 // Verifica se formulario.codigo tem um valor numérico, caso positivo é uma edição de Lançamento.
  get editando() {
  //  return Boolean(this.lancamento.codigo);
    return Boolean(this.formulario.get('codigo').value);
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
   // this.lancamento = lancamento;
   this.formulario.patchValue(lancamento);  // atribui ao objeto formulario o objeto lancamento, com suas propriedades e valores
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
  // Eliminamos o parâmetro form em salvar(form) pois os métodos aqui já manipulam o formulario
  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

 // Eliminamos o parâmetro form em adicionarLancamento(form) pois os métodos aqui já manipulam o formulario
  async adicionarLancamento() {
    try {
    // Pega todas as propriedades/valor do formulario this.formulario.value  e passa para o service
     const lancamentoAdicionado = await  this.lancamentoService.adicionar(this.formulario.value);
     this.toasty.success('Lancamento adicionado com sucesso!');
    //  form.reset({tipo: this.lancamento.tipo});
    //  this.lancamento = new Lancamento();
     this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
    } catch (erro) {
      return this.errorHandler.handle(erro);
    }
  }

  // Eliminamos o parâmetro form em atualizarLancamento(form) pois os métodos aqui já manipulam o formulario
  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
    .then(lancamento => {
      // this.lancamento = lancamento;
      // atribui as propriedades e valores do lancamento passado por arrowFunction ao objeto formulario
      this.formulario.patchValue(lancamento);
      this.toasty.success('Lancamento alterado com sucesso!');
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  // Eliminamos o parâmetro form em novo(form) pois os métodos aqui já manipulam o formulario
   novo() {
   // this.lancamento = new Lancamento();
   // form.reset({tipo: this.lancamento.tipo});
    this.formulario.reset();
    this.router.navigate([ '/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Editar Lançamento: ${this.formulario.get('descricao').value}`);
  }


}
