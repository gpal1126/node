const express = require('express');
const router = express.Router();
const passport = require('passport');

const crypto = require('crypto');       //암호 모듈

const { isLoggedIn, isNotLoggedIn } = require('./mdlwrLogged'); //로그인/로그아웃 미들웨어

/* 로그인 관련 */
router.post('/login', isNotLoggedIn, (req, res, next) => {  //1. 로그인 요청
    passport.authenticate('local', (authError, user, info) => { //2. passport.authenticate 메서드 호출
        if( authError ){
            return next(authError);
        }

        if( !user ){    //로그인 실패 메시지 리턴
            req.flash('loginError', info.message);
            return res.json(info.message);
        }
        
        return req.login(user, (loginError) => {    //4. 로그인 성공시 유저 정보를 가지고 req.login 호출
            if( loginError ){
                return next(loginError);
            }
            console.log('로그인중')
            const userType = req.user.user_type;
            const userId = req.user.user_id;
            let userInfo  = { 'type': userType, 'id': userId };
            userInfo = JSON.stringify(userInfo);
            let options = {
                //maxAge: 1000 * 60 // would expire after 1 minute
                maxAge: 1000 * 60 * 60 // would expire after 1 hours
                //httpOnly: true // The cookie only accessible by the web server
                //signed: true // Indicates if the cookie should be signed
            }

            if(user.deleted == 1){ //탈퇴한 회원 
                return res.json('deleted'); //회원 탈퇴 시 deleted 값을 넘겨줌
            }else{
                res.cookie('u_info', userInfo, options);
                res.clearCookie('referrer');    //원래(이전) 페이지로 이동 cookie 삭제
                return res.json(1); //로그인 성공시 값 1 리턴
            }
        });
    })(req, res, next);
});

/* 로그아웃 관련 */
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.clearCookie('u_info');
    req.session.destroy();
    res.redirect('/');
});

//naver 로그인
router.get('/naver/login', passport.authenticate('naver'));

//naver 로그인 연동 콜백
router.get('/naver/callback', 
    passport.authenticate('naver', {
        failureRedirect: '/users/login'
    }), (req, res) => {
        //successRedirect: '/'
        //res.redirect('/');
        console.log('???????');
        //console.log(req.user);
        //console.log(req.user.mod_date);

        const userType = req.user.user_type;
        const userId = req.user.user_id;
        let userInfo  = { 'type': userType, 'id': userId };
        userInfo = JSON.stringify(userInfo);
        let options = {
            maxAge: 1000 * 60 * 60 // would expire after 1 hours
            //httpOnly: true // The cookie only accessible by the web server
            //signed: true // Indicates if the cookie should be signed
        }
        res.cookie('u_info', userInfo, options);

        const mod_date = req.user.mod_date;
        //네이버 연동 로그인시 데이터 수정을 안했으면 
        if( mod_date === null ){
            //res.redirect('/');
            res.send("<script>alert('네이버로 간편하게 로그인을 하셨습니다!\\n회원 정보를 수정하시면\\n좀더 다양한 서비스를 이용하실 수 있습니다.'); location.href='/users/modifyUserInfo';</script>");
        }else {
            //로그인 후 원래 있던 페이지로 이동
            const referrer = req.cookies.referrer;
            console.log('referrer:::'+referrer);
            if( referrer !== undefined ){
                res.clearCookie('referrer');    //원래(이전) 페이지로 이동 cookie 삭제
                res.redirect(referrer);
            }else{
                res.redirect('/');
            }
        }
    }
);

module.exports = router;