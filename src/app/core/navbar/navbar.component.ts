
import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService,
              private route: Router,
              private errorHandler: ErrorHandlerService ) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.route.navigate(['/login']);
      })
     .catch(erro => this.errorHandler.handle(erro));
  }
}


