/*** Route : 경로 컨트롤러 매핑 ***/
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

const fileCntrl = require('../../controllers/c_b_file');  //board file 컨트롤러

const upload = require('../../common/upload'); //파일 업로드 공통 func

/* 파일 업로드 */
var cpUpload = upload.fields([{ name: 'file', maxCount: 8 }]);
router.post('/uploadFile', upload.single('file'), function(req, res){
    return fileCntrl.uploadFile(req, res);
});

/* 파일 insert */
router.post('/insertFile', upload.single('file'), function(req, res){
    return fileCntrl.insertFile(req, res);
});

/* 파일 삭제 */
router.delete('/deleteFile', function(req, res){
    console.log('d route req.body');
    console.log(req.body);
    return fileCntrl.deleteFile(req, res);
});

/* 파일 select */
router.get('/selectFileByBoardId', function(req, res){
    return fileCntrl.selectFileByBoardId(req, res);
});

/* 파일 데이터 삭제 */
router.delete('/deleteFileData', function(req, res){
    return fileCntrl.deleteFileData(req, res);
});

module.exports = router;