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
router.get('/', function(req, res){
    console.log('Get join url');
    res.sendFile((path.join(__dirname, '../../', '/public/join.html')));
});

// POST
router.post('/', function(req, res){
    console.log('Post join');
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    console.log(email, name, password);

    //let query = conn.query('INSERT INTO USER_TB(email, name, pw) VALUES(?, ?, ?)', [email, name, password], function(err, rows){
    let sql = { email: email, name: name, pw: password };
    let query = conn.query('INSERT INTO USER_TB SET ? ', sql, function(err, rows){
        if( err ) throw err;
        console.log("ok db insert : ", rows.insertId, name);
        res.render('welcome.ejs', { 'id': rows.insertId, 'name':name });
    });
});

module.exports = router;