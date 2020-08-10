const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

//main page는 login이 될 때만(즉 세션정보가 있을때만) 접근이 가능하도록 한다.
router.get('/', function(req, res){
    console.log('main js loaded', req.user);
    let id = req.user;
    //res.sendFile(path.join(__dirname, '../../', '/public/main.html'));
    res.render('main.ejs', {'id':id});
});

module.exports = router;
