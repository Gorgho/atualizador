var xml2js = require('xml2js');
var request = require('request');
var rp = require('request-promise');
const Pipedrive = require('pipedrive');
const pipedrive = new Pipedrive.Client('fdc0f36f6db6c14b72001cef095d37b225c0f2d4', { strictMode: true });

//variaveis


exports.post = (req, res, next) => {
   chamadaPrincipal(req);
   res.status(200).send({
        descrição: 'fim',
    });
};

function _getXMLRequest(obj) {
    let xml =
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
        <Login xmlns="http://diretrixon.com/WebServices">
            <Usuario>moringadigital</Usuario>
            <Senha>moringa2019</Senha>
            <Cliente>moringadigital</Cliente>
        </Login>
    </soap:Header>
    <soap:Body>
        <LocalizadorMaisOpcoes xmlns="http://diretrixon.com/WebServices">
            <nome></nome>
            <cidade></cidade>
            <uf></uf>
            <cep></cep>
            <telefone>${obj.telefone}</telefone>
            <email>${obj.email}</email>
            <dataNascimentoAbertura></dataNascimentoAbertura>
            <tipoPessoa>pf</tipoPessoa>
            <idProduto>7</idProduto>
        </LocalizadorMaisOpcoes>
    </soap:Body>
    </soap:Envelope>`;
    return xml;
}

function _getOptions(xml) {
    let options = {
        url: 'https://diretrixon.com/diretrixws/recupera.asmx?wsdl',
        method: 'POST',
        body: xml,
        headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Accept-Encoding': 'gzip,deflate',
            'Content-Length': xml.length,
            'SOAPAction': "http://diretrixon.com/WebServices/LocalizadorMaisOpcoes"
        }
    };
    return options;
}

//desmembrar para ficar assincrono
function _request(xml) {
    var options = _getOptions(xml);
    // request(options, (error, response, body) => {
    //     if (!error && response.statusCode == 200) {
    //         var parser = new xml2js.Parser({ headless: true, explicitRoot: false, normalize: true});
    //         parser.parseString(body, (err, result) => {
    //             var resultado = result['soap:Body'][0];
    //             resultado = resultado['LocalizadorMaisOpcoesResponse'];
    //             resultado = resultado[0].LocalizadorMaisOpcoesResult[0];
    //             return JSON.parse(resultado);
    //         });
    //     };
    // });
    rp(options)
        .then(function (body) {
                    var parser = new xml2js.Parser({ headless: true, explicitRoot: false, normalize: true});
                    parser.parseString(body, (err, result) => {
                        var resultado = result['soap:Body'][0];
                        resultado = resultado['LocalizadorMaisOpcoesResponse'];
                        resultado = resultado[0].LocalizadorMaisOpcoesResult[0];
                        return JSON.parse(resultado);
                    });
        })
        .catch(function (err) {
            // POST failed...
        });
};

function chamadaPrincipal(req){    
    pipedrive.Persons.get(req.body.current.person_id, function (err, pessoa) {        
        if(err) throw err;
        var listaPesquisa = [];
        if (pessoa.email.length > 0) {
            pessoa.email.forEach(e =>{
                var obj = {};
                obj.email = e.value;
                obj.telefone = '';
                listaPesquisa.push(obj);
            });
        }
        if(pessoa.phone.length > 0){
            pessoa.phone.forEach(tel => {
                var obj = {};
                obj.email = '';
                obj.telefone = tel.value;
                listaPesquisa.push(obj);
            });
        };
        etapa1(listaPesquisa);
    });
};


function etapa1(lista) {
    if (lista.length > 0) {
        lista.forEach(item =>{
            var xml = _getXMLRequest(item);
            var obj = _request(xml);
            //etapa2(obj);
        });
    }
};

function etapa2(lista) {
    lista.forEach(item =>{
        if(item.hasOwnProperty('maisPf')){
            item.forEach(person => {
                console.log(person);
            });
        }
    });
}
