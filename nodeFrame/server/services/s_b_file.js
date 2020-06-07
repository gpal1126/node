/*** Service : 데이터 처리 ***/
'use strict'; //엄격모드

//const db = require('../db/db_base');    //db 정보
//const User = require('../models').User;  //스키마 연결

const Sequelize = require('sequelize');
const { BFile } = require('../models');  //스키마 연결

/* 파일 등록 */
const insertFile = function(req, res){
    try {

        const boardId = req.body.bId;
        const boardCatId = req.body.bcId;
        //const newPath = req.body.newPath.split('public')[1];   // /images/upload/board/bc_1/u_1/b_1/
        let userId;
        if( req.user !== undefined ){   //임시 방편
            userId = req.user.user_id;
        }else {
            userId = 1;
        }
        let insertFileObj = req.body.insertFileObj;
        insertFileObj = JSON.parse(insertFileObj);
        console.log(req.body);
        console.log('boardId:::'+boardId);
        console.log('boardCatId:::'+boardCatId);
        console.log(insertFileObj);

        /* db 컬럼에 맞추어 key rename */
        insertFileObj = insertFileObj.map(function(item){
            return { 
                board_id : boardId,
                board_cat_id : boardCatId,
                user_id : userId,
                file_dir : item.fileDir,
                file_name : item.fileName,
                size: item.size,
                extension: item.extension,

            }
        });
        
        /* insertFileObj.map(function(item){
            item.board_id = boardId;
            item.board_cat_id = boardCatId;
            item.user_id = user_id;
        }); */

        console.log(insertFileObj);

        BFile.bulkCreate(insertFileObj).then( rst => {
            console.log('rst::::');
            //console.log(rst);

            if( rst !== undefined ){
                console.log('들어오나???')
                res.json(1);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 파일 조회 */
const selectFileByBoardId = function(req, res){
    try {

        let boardId = req.query.bId;
        console.log('파일 조회 boardId::'+boardId);

        BFile.findAll({
            where: { board_id: boardId }
        }).then( rst => {
            console.log('rst::::');
            console.log(rst);
            const fileArr = new Array();
            for(let i=0; i<rst.length; i++){
                const fileId = rst[i].file_id;
                const fileDir = rst[i].file_dir;
                const fileName = rst[i].file_name;
                const size = rst[i].size;
                const extension = rst[i].extension;
                const json = { 'fId':fileId, 'fileDir':fileDir, 'fileName':fileName, 'size':size, 'extension':extension };
                fileArr.push(json);
            }

            if( rst !== undefined ){
                res.json(fileArr);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 파일 삭제 */
const deleteFileData = function(req, res){
    try {

        //console.log(req.body);
        let fileId = req.body.fId;
        console.log('fileId::'+fileId);

        BFile.destroy({
            where: { file_id: fileId }
        }).then( rst => {
            console.log('rst::::');
            //console.log(rst);

            if( rst !== undefined ){
                res.json(1);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    insertFile: insertFile,
    selectFileByBoardId: selectFileByBoardId,
    deleteFileData: deleteFileData,
};