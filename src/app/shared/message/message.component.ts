import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
    <div *ngIf="temErro()" class="ui-messages ui-messages-error">
    {{text}}
    </div>
  `,
  styles: [`
  .ui-messages-error {
    margin-top: 3px;
    padding: .5em;
    border-radius: 5px;
  }`]
})
export class MessageComponent  {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;

  temErro(): boolean {
    return  this.control.hasError(this.error) && this.control.dirty;
  }

}
