const Pipedrive = require('pipedrive');
const pipedrive = new Pipedrive.Client('fdc0f36f6db6c14b72001cef095d37b225c0f2d4', { strictMode: true });

var soapCliente = 'moringadigital';
var soapSenha = 'moringadigital2019';

var cnpj = '65fb8d4b08bbb6c9cb7c582cb8eb8c8a6efff8d3';

exports.get = (req, res, next) => {
    var HtmlContent = '<h1>Resultados diretrix</h1><p> nome completo: Fulano da Silva</p><p> perfil demografico (classe social): pobre d+</p><h3>perfile de consumo</h3><p>segmento cluster: valor segmento</p><p>descricao cluster: valor descricao</p><p>renda cluster: valor renda</p><p> participação empresarial: valor participação</p>';
    var objEnvio = {
        'content': HtmlContent,
        'deal_id': '1'};
    pipedrive.Notes.add(objEnvio, function(err, note) {
        if (err) throw err;
        res.status(200).send({
            descrição: 'foi adicionado',
            nota: note}
        );
        
    });
};