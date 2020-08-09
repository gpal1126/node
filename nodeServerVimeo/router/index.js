const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

const main = require('./main/main');
const email = require('./email/email');
const join = require('./join/index');

router.use('/main', main);
router.use('/email', email);
router.use('/join', join);

//url routing
router.get('/', function(req, res){
    //res.send('<h1>hello node.js</h1>');
    console.log('indexjs /path loaded');
    res.sendFile(path.join(__dirname, '../', '/public/main.html'));
});

module.exports = router;