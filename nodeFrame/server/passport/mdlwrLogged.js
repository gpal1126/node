const express = require('express');
const router = express.Router();

/*** 로그인 된 여부 체크 미들웨어 ***/
router.isLoggedIn = (req, res, next) => {   //로그인 된 경우에만 접근할 수 있는 것, 회원정보, 회원탈퇴,...
    if( req.isAuthenticated() ){
        next();
    }else {
        //로그인 후 원래 있던 페이지로 이동하기 위해 세션에 담음
        const referrer = req.originalUrl;
        console.log('referrer:::'+referrer);
        console.log(req.session);
        //req.session.referrer = referrer;
        res.cookie('referrer', referrer);
        res.send("<script>alert('로그인이 필요한 서비스입니다.'); location.href='/users/login';</script>");
    }
}

/*** 로그인 안된 여부 체크 미들웨어 ***/
router.isNotLoggedIn = (req, res, next) => {    //로그인이 안된 경우에만 접근할 수 있는 것, 회원가입, 비밀번호 찾기
    if( !req.isAuthenticated() ){
        next();
    }else {
        res.redirect('/');
    }
}

/*** 둘다 접근 가능 미들웨어 ***/
router.allLogged = (req, res, next) => {   //둘다 접근 가능
    if( req.isAuthenticated() || !req.isAuthenticated() ){
        next();
    }else {
        console.log('둘다 접근 가능');
    }
}

/*** JWT 인증 ***/
/* router.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch(err) {
        if( err.name === 'TokenExpiredError' ){    //유효기간 초과
            return res.status(419).json({
                code: 419,
                message:'토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
}; */

/*** session 체크 ***/
router.sessionChk = (req, res, next) => {
    console.log('세션 체크중!!!!!!');
    console.log(req.user)
    if( !req.user ){
        console.log('세션없음');
        res.clearCookie('u_info');
        req.logout();
        res.clearCookie('sessionID');
        req.session.destroy();
    }else {
        console.log('세션있음');
    }
}

module.exports = router;