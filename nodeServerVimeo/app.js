const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router/index');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteneded:true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialize: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);

app.listen(3000, function(){
    console.log("start! express server on port 3000");
});

