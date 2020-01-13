const express = require('express');

//Objeto que representa nossa aplicação
const app = express();
//servir os arquivos staticos (javaScript, css, imagens, etc), pegando dinamicamente o caminho de /dist
app.use(express.static(__dirname + '/dist'));

//todas as requisições seram direcionadas para index em que retorna um file.
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

//Escuta a porta definida na variável de ambiente ou se não tiver, a 4200
app.listen(process.env.PORT || 4200);
