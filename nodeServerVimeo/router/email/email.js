const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mysql = require('mysql');

// DATABASE SETTING
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', 
    password: '1234',
    database: 'test',
});

conn.connect();

// GET
router.get('/form', function(req, res){
    //res.send('<h1>hello node.js</h1>');
    res.sendFile(path.join(__dirname, '../../', '/public/form.html'));
});

// POST
// Roter
router.post('/form', function(req, res){
    console.log(req.body.email);
    res.send(`<h1>welcome ${req.body.email}</h1>`);
});

router.post('/ajax', function(req, res){
    let email = req.body.email;
    let responseData = {};
    console.log(responseData);

    let query = conn.query('SELECT name FROM USER_TB WHERE email=?', email, function(err, rows){
        if( err ) throw err;
        if( rows[0] ){
            console.log(rows[0]);
            responseData.result = 'ok';
            responseData.name = rows[0].name;
        }else {
            console.log('none: '+rows[0]);
            responseData.result = 'none';
            responseData.name = "";
        }
        res.json(responseData);
    });
});

module.exports = router;