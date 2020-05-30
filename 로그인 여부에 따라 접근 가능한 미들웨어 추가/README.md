## 로그인 여부에 따라 접근 가능한 미들웨어 추가

### mdlwrLogged.js
```
const express = require('express');
const router = express.Router();

/*** 로그인 된 여부 체크 미들웨어 ***/
router.isLoggedIn = (req, res, next) => {  //로그인 된 경우에만 접근할 수 있는 것, 회원정보, 회원탈퇴,...
    //console.log(req)
    if( req.isAuthenticated()) {    
        next();
    }else {
        res.status(403).send('로그인 필요');  
    }
}

/*** 로그인 안된 여부 체크 미들웨어 ***/
router.isNotLoggedIn = (req, res, next) => {   //로그인이 안된 경우에만 접근할 수 있는 것, 회원가입, 비밀번호 찾기
    if( !req.isAuthenticated() ) {  
        next();
    }else {
        res.status(403).send('이미 로그인');
    }
}

/*** 둘다 접근 가능 미들웨어 ***/
router.allLogged = (req, res, next) => {   //둘다 접근 가능
    if( req.isAuthenticated() || !req.isAuthenticated() ){
        next();
    }else {
        res.status(403).send('로그인 하든 안하든 접근 가능');
    }
}

module.exports = router;
```

### r_vr_users.js의 두번째 인자에 로그인 여부 미들웨어 추가
- 회원가입(로그인이 안된 경우 접근 가능한 페이지) : mdlwrLogged.isNotLoggedIn 추가 
- 회원정보(로그인이 된 경우 접근 가능한 페이지) : mdlwrLogged.isLoggedIn 추가 
```
const mdlwrLogged = require('../../passport/mdlwrLogged');

router.get('/:id', function(req, res, next){    //로그인 여부에 따라 접근 가능한 페이지 미들웨어 func
    const urlParamId = req.params.id;  //넘어온 url id    
    console.log('로그인 여부에 따라 접근 가능한 페이지 미들웨어 func');
    console.log('urlParamId:::'+urlParamId);
    
    if( ['modifyUserInfo'].includes(urlParamId) ){
        mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
    }else if ( ['joinUser', 'login'].includes(urlParamId) ){
        mdlwrLogged.isNotLoggedIn(req, res, next);  //로그인 안된 경우에만 접근 가능한 미들웨어
    }else if ( ['provision'].includes(urlParamId) ){
        mdlwrLogged.allLogged(req, res, next);  //둘다 접근 가능
    }

}, function(req, res){    //페이지 이동 func
    ...생략
});
```

