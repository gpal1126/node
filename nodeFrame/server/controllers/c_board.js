/*** Controller : 로직 처리 ***/
'use strict'; //엄격모드
const fs = require('fs');

const boardService = require('../services/s_board');

/* 게시판 카테고리 리스트 */
const listBoardCat = async function(req, res){
    try {
        return await boardService.listBoardCat(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시판 리스트 */
const listBoard = async function(req, res){
    try {
        return await boardService.listBoard(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 id insert */
const insertBoardId = async function(req, res){
    try {
        return await boardService.insertBoardId(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 등록 */
const writeBoard = async function(req, res){
    try {
        return await boardService.insertBoard(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 작성 페이지 벗어날시 board 빈 데이터 삭제 */
const deleteEmptyBoard = async function(req, res){
    try {

        let boardCatId = req.body.bcId;
        let userId;
        if( req.user !== undefined ){   //임시방편
            userId = req.user.user_id;
        } else {
            userId = 1;
        }
        let boardId = req.body.bId;
        /* 해당 폴더 삭제 */
        let removeDir = `public/images/upload/board/bc_${boardCatId}/u_${userId}/b_${boardId}`;
        fs.rmdir(removeDir, function(err){
            if(err) console.log(err);        
            console.log("폴더가 삭제 되었습니다.")          
        });
        
        return await boardService.deleteEmptyBoard(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 상세페이지 */
const detailBoard = async function(req, res){
    try {
        return await boardService.selectBoardById(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 조회수 증가 */
const increaseViews = async function(req, res){
    try {
        return await boardService.updateViews(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 수정 */
const modifyBoard = async function(req, res){
    try {
        return await boardService.updateBoard(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 삭제 */
const deleteBoard = async function(req, res){
    try {
        return await boardService.deleteBoard(req, res);
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    listBoardCat: listBoardCat,
    listBoard: listBoard,
    insertBoardId: insertBoardId,
    writeBoard: writeBoard,
    deleteEmptyBoard: deleteEmptyBoard,
    detailBoard: detailBoard,
    increaseViews: increaseViews,
    modifyBoard: modifyBoard,
    deleteBoard: deleteBoard,
};
