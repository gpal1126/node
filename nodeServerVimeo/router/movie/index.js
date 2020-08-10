const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const { response } = require('express');
const { ifError, doesNotMatch } = require('assert');

// DATABASE SETTING
const conn = mysql.createConnection({
    host: '211.253.31.56',
    port: 3306,
    user: 'lindas', 
    password: 'Wlstns676@!',
    database: 'test',
});

conn.connect();

// movie list 
router.get('/list', function(req, res){
    res.render('movie.ejs');
});

// 1. /movie, GET
router.get('/', function(req, res){
    let responseData = {};

    let query = conn.query('SELECT title FROM MOVIE_TB', function(err, rows){
        if( err ) throw err;
        if( rows.length ){
            responseData.result = 1;
            responseData.data = rows;
        }else {
            responseData.result = 0;
        }
        res.json(responseData);
    });
});

// 2. /movie, POST
router.post('/', function(req, res){
    let title = req.body.title;
    let type = req.body.type;
    let grade = req.body.grade;
    let actor = req.body.actor;
    console.log(title, type, grade, actor);

    //let query = conn.query('INSERT INTO MOVIE_TB(title, type, grade, actor) VALUES(?, ?, ?, ?)', [title, type, grade, actor], function(err, rows){
    let sql = { title, type, grade, actor };
    let query = conn.query('INSERT INTO MOVIE_TB SET ?', sql, function(err, rows){
        if( err ) throw err;
        return res.json({'result': 1});
    });
});

module.exports = router;