import { CoreModule } from './core.module';
import { Injectable } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: CoreModule
})
export class ErrorHandlerService {

  constructor(private toasty: ToastyService) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';
      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) { }
      console.error('Ocorreu um erro', errorResponse);
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }
    this.toasty.error(msg);
  }

}
