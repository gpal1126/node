/*** Controller : 로직 처리 ***/
'use strict'; //엄격모드

const crypto = require('crypto');   //암호화 관련 모듈
const bcrypt = require('bcrypt');   //암호화 관련 모듈

//const multer = require('multer');
//const path = require('path');
const fs = require('fs');

const userService = require('../services/s_users');

/* 회원 가입 */
const joinUser = async function(req, res) {
    try {
        let password = req.body.password;
        //console.log('password:::'+password);

        
        //bcrypt를 이용한 암호화, hash를 이용하여 간단하지만 보안성이 강하다, 두번째 인자값은 반복 횟수와 비슷하다 12~31까지 사용 가능
        bcrypt.hash(password, 12, function(err, hash){
            //console.log(hash);
            req.body.password = hash;
            req.body.secretkey = makeToken();   //시크릿키 생성

            return await userService.insertUser(req, res);
        });
        
    }catch(err){
        console.log(err);
    }
}

/* 유저 정보 가져오기 */
const getUserInfoById = async function(req, res) {
    try {
        return await userService.selectUserInfoById(req, res);
    }catch(err){
        console.log(err);
    }
};

/* 유저 정보 수정 */
const modifyUserInfo = async function(req, res){
    try {
        return await userService.updateUserInfo(req, res);
    }catch(err) {
        console.log(err);
    }
};

/* 회원 탈퇴 */
const widthdrawalUser = async function(req, res){
    try {
        return await userService.deleteUser(req, res);
    }catch(err) {
        console.log(err);
    }
};

/* 토큰 생성 */
function makeToken(){
    //랜덤 6자리
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('random:::'+random);
    let hmac = crypto.createHmac('sha256', random);
    
    const timestamp = new Date().getTime().toString();
    hmac.update(timestamp);

    hmac = hmac.digest('base64');
    return hmac;
}

module.exports = {
    joinUser: joinUser,
    getUserInfoById: getUserInfoById,
    modifyUserInfo: modifyUserInfo,
    widthdrawalUser: widthdrawalUser,
};
