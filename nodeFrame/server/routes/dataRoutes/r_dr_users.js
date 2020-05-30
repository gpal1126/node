/*** Route : 경로 컨트롤러 매핑 ***/
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

var cache = require('memory-cache');    //메모리 캐시 모듈

const userCntrl = require('../../controllers/c_users');  //유저 컨트롤러

/* 회원가입 */
router.post('/joinUser', function(req, res){
    return userCntrl.joinUser(req, res);
});

/* 유저 정보 가져오기 */
router.get('/getUserInfoById', function(req, res){
    return userCntrl.getUserInfoById(req, res);
});

/* 유저 정보 수정 */
router.put('/modifyUserInfo', function(req, res){
    return userCntrl.modifyUserInfo(req, res);
});

/* 회원 탈퇴 */
router.delete('/widthdrawalUser', function(req, res){
    return userCntrl.widthdrawalUser(req, res);
});

module.exports = router;