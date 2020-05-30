const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

var device = require('express-device'); //device 관련(device type별로 구분) 
app.use(device.capture());

const usersViewRouter = require('./server/routes/viewRoutes/r_vr_users'); //user 뷰 라우터 경로
const usersDataRouter = require('./server/routes/dataRoutes/r_dr_users'); //user 데이터 라우터

/* 로그인 관련 모듈 */
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();   //.env 파일의 환경변수 설정 / 암호화로 처리

const { sequelize } = require('./server/models');   //require('./server/models/index.js').sequelize index.js 생략
const authRouter = require('./server/passport/auth');
const passportConfig = require('./server/passport');      //require('./server/passport/index.js') index.js 생략
sequelize.sync();
passportConfig(passport);

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,    //.env 파일에서 암호화하여 생성
    name: 'sessionID',
    cookie: {
        secure: false,  // HTTPS를 통해서만 쿠키를 전송하도록
        httpOnly: true, //클라이언트 JavaScript가 아닌 HTTP(S)를 통해서만 전송되도록
        //domain: '', //쿠키의 도메인을 표시
        //path : '',  //쿠키의 경로를 표시
        //expires: expiryDate //만기 날짜를 설정
        //maxAge: 1000 * 60 // would expire after 1 minute
        maxAge: 1000 * 60 * 60 // would expire after 1 hours
    },
}));
app.use(flash());
app.use(passport.initialize()); //req 객체에 passport 설정을 심는다.
app.use(passport.session());    //req.session 객체에 passport 정보 저장
/* 로그인 관련 모듈 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//view 단에서 사용할 path 잡아줌 ex) /js~ 나 /views~
app.use('/views', express.static(__dirname + '/views')); //view단에서 사용할 views path 잡아줌
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); //npm jquery 경로 설정
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js')); //npm bootstrap js 경로 설정
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css')); //npm bootstrap css 경로 설정

app.use('/users', usersViewRouter);   //유저 뷰 라우터
app.use('/d_users', usersDataRouter); //유저 데이터 라우터

app.use('/auth', authRouter); //로그인/로그아웃 라우터

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
