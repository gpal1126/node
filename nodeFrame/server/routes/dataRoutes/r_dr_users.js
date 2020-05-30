/*** Route : 경로 컨트롤러 매핑 ***/
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload= require('../../common/upload'); //파일 업로드 공통 func

var cache = require('memory-cache');    //메모리 캐시 모듈

const userCntrl = require('../../controllers/c_users');  //유저 컨트롤러

/* 회원가입 */
router.post('/joinUser', upload.single('file'), function(req, res){
    return userCntrl.joinUser(req, res);
});

/* 유저 정보 가져오기 */
router.get('/getUserInfoById', function(req, res){
    return userCntrl.getUserInfoById(req, res);
});

/* 유저 정보 수정 */
router.put('/modifyUserInfo', upload.single('profile'), function(req, res){
    //기존 이미지
    const dbImgPath = req.body.dbImgPath;
    console.log('dbImgPath:::'+dbImgPath);
    const profilUpdateChk = JSON.parse(req.body.profilUpdateChk);   //프로필 업데이트 했는지 체크 
    console.log('profilUpdateChk:::'+profilUpdateChk);

    //기존 이미지가 no_profile.png 가 아니면서 프로필 수정 했을 경우 기존 이미지 삭제
    if(  !dbImgPath.includes('no_profile.png') && profilUpdateChk ){
        const removeImgPath = 'public\\'+dbImgPath;
        //기존 이미지 삭제
        fs.unlink(removeImgPath, (err) => {
            if (err) {
              console.error(err)
              return
            }   
            //file removed
        });
    }

    return userCntrl.modifyUserInfo(req, res);
});

/* 회원 탈퇴 */
router.delete('/widthdrawalUser', function(req, res){
    return userCntrl.widthdrawalUser(req, res);
});

module.exports = router;