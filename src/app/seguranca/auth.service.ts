import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: any;
  tokensRevokeUrl = 'http://localhost:8080/tokens/revoke';

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService ) {
                this.carregarToken();
              }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
    .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
    .toPromise()
    .then(response => {
      console.log(response);
      this.armazenarToken(JSON.parse(JSON.stringify(response)).access_token);
    })
    .catch(response => {
      const responseError = response.error;
      if (response.status === 400) {
        if (responseError.error === 'invalid_grant') {
          return Promise.reject('Usuário ou senha inválida!');
        }
      }
      return Promise.reject(response);
    });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
    .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
    .toPromise()
    .then(response => {
      this.armazenarToken(JSON.parse(JSON.stringify(response)).access_token);
      return Promise.resolve(null);
    })
    .catch(response => {
      console.error('Erro ao renovar token', response);
      return Promise.resolve(null); // Se der erro não tem o que fazer (não tem tratamento) por isso não usamos reject.
    });

  }

  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true})
    .toPromise()
    .then(() => {
      this.limparAccessToken();
    });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    // armazena os dados do token no browser do usuário, no local storage.
    localStorage.setItem('token', token);
  }
  // carrega o token do local storage do navegador do usuario.
  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }
}
