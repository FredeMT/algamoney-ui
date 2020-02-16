import { Component, OnInit, Input } from '@angular/core';
import { Contato } from 'src/app/core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

  @Input() contatos: Array<Contato>;
  contato: Contato;
  exibindoFormularioContato = false;
  contatoIndex: number;

  constructor() { }

  ngOnInit() { }

  prepararNovoContato() {
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length;
    this.exibindoFormularioContato = true;
  }

  removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  confirmarContato(frm) {
    this.contatos[this.contatoIndex] = this.contato;
   // this.pessoa.contatos.push(this.contato);
    this.exibindoFormularioContato = false;
    frm.reset(this.contato);
  }

  prepararEdicaoContato(contato: Contato, rowIndex: number) {
    this.contato = Object.create(contato);
    this.contatoIndex = rowIndex;
    this.exibindoFormularioContato = true;
  }

  get editando() {
    return this.contato && this.contato.codigo;
  }
}
