const bodyParser = require("body-parser");
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Rotas
const index = require('./routes/index');
app.use('/', index);
const deal = require('./routes/deal');
app.use('/deal', deal);
module.exports = app;