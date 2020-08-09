const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const router = require('./router/index');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extened:true }));
app.set('view engine', 'ejs');

app.use(router);

app.listen(3000, function(){
    console.log("start! express server on port 3000");
});

