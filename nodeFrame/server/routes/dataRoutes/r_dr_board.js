/*** Route : 경로 컨트롤러 매핑 ***/
'use strict';

const express = require('express');
const router = express.Router();

const boardCntrl = require('../../controllers/c_board');  //보드 컨트롤러

/* 게시판 카테고리 리스트 */
router.get('/listBoardCat', function(req, res){
    return boardCntrl.listBoardCat(req, res);
});

/* 게시판 리스트 */
router.get('/listBoard', function(req, res){
    return boardCntrl.listBoard(req, res);
});

/* 게시글 id insert */
router.post('/insertBoardId', function(req, res){
    return boardCntrl.insertBoardId(req, res);
});

/* 게시글 등록 */
router.post('/writeBoard', function(req, res){
    return boardCntrl.writeBoard(req, res);
});

/* 게시글 작성 페이지 벗어날시 board 빈 데이터 삭제 */
router.delete('/deleteEmptyBoard', function(req, res){
    return boardCntrl.deleteEmptyBoard(req, res);
});

/* 게시글 상세 페이지 */
router.get('/detailBoard', function(req, res){
    return boardCntrl.detailBoard(req, res);
});

/* 게시글 조회수 증가 */
router.put('/increaseViews', function(req, res){
    return boardCntrl.increaseViews(req, res);
});

/* 게시글 수정 */
router.put('/modifyBoard', function(req, res){
    return boardCntrl.modifyBoard(req, res);
});

/* 게시글 삭제 */
router.delete('/deleteBoard', function(req, res){
    return boardCntrl.deleteBoard(req, res);
});

module.exports = router;