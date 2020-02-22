export const environment = {
  production: true,
   apiUrl: 'https://algamoney-frd-api.herokuapp.com',
   tokenWhitelistedDomains: [ new RegExp('algamoney-frd-api.herokuapp.com') ],
   tokenBlacklistedRoutes: [new RegExp('\/oauth\/token')]
   /* Para teste com api em localhost, do build em produção
  apiUrl: 'http://localhost:8080',
  tokenWhitelistedDomains: [ 'localhost:8080'] */
};
