var express = require('express');
var router = express.Router();

const fs =require('fs');  //파일 관련 모듈

const mdlwrLogged = require('../../passport/mdlwrLogged');

/* GET users listing. */
router.get('/:id', function(req, res, next){    //로그인 여부에 따라 접근 가능한 페이지 미들웨어 func

    //세션 체크
    mdlwrLogged.sessionChk(req, res, next);

    const urlParamId = req.params.id;  //넘어온 url id    
    console.log('urlParamId:::'+urlParamId);
    
    //로그인 여부에 따라 접근 가능한 페이지 미들웨어 func
    if( ['modifyUserInfo'].includes(urlParamId) ){
        mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
    }else if ( ['joinUser', 'login'].includes(urlParamId) ){
        mdlwrLogged.isNotLoggedIn(req, res, next);  //로그인 안된 경우에만 접근 가능한 미들웨어
    }else if ( ['provision'].includes(urlParamId) ){
        mdlwrLogged.allLogged(req, res, next);  //둘다 접근 가능
    }

}, function(req, res) {
    const urlParamId = req.params.id;  //넘어온 url id
    console.log('페이지 이동 func');
    console.log('urlParamId:::'+urlParamId);

    let deviceType = req.device.type.toUpperCase(); //device type
    //console.log('deviceType::::::::::::::::::::::::::::::::::::::'+deviceType);
    if( deviceType === 'DESKTOP' ){
        deviceType = 'web';
    }else if( ['TABLET', 'PHONE'].includes(deviceType) ){
        //deviceType = 'mobile';  //mobile 제작할시 사용
        deviceType = 'mobile';
    }else {
        deviceType = 'web';
    }//if

    
    let fileName;               //파일명

    //객체 리터럴로 urlParamId 값과 파일명 매핑
    const objUrlId = {
        'joinUser' : 'u_join_user',             //유저 가입 페이지
        'modifyUserInfo' : 'u_modify_info',      //유저 정보 수정 페이지
        'provision' : 'u_provision',            //이용약관 보기 페이지
        'login' : 'u_login',                    //로그인 페이지
    }

    //Object.entries(objUrlId) : 객체 -> 배열
    fileName = Object.entries(objUrlId).find(function(v){   //객체를 배열로 변환하여 찾음
        //console.log(v[0]);    //index 0은 urlParamId
        //console.log(v[1]);    //index 1은 파일명
        return v[0] === urlParamId;  //배열 값과 넘어온 urlParamId 값과 비교
    })[1];

    console.log('fileName:::'+fileName);

    const readFileUrl = `views/${deviceType}/users/${fileName}.html`;
    
    fs.readFile(readFileUrl, function(err, data){
        res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
        res.end(data);
    });
});

module.exports = router;