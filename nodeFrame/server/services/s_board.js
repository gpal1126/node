/*** Service : 데이터 처리 ***/
'use strict'; //엄격모드

//const db = require('../db/db_base');    //db 정보
//const User = require('../models').User;  //스키마 연결

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Board } = require('../models');  //스키마 연결
const { BoardCat } = require('../models');  //스키마 연결
const { BFile } = require('../models');  //스키마 연결
const { Reply } = require('../models');  //스키마 연결

/* 게시판 카테고리 리스트 */
const listBoardCat = function(req, res){
    try {

        BoardCat.findAll({
            attributes: [ 'board_cat_id', 'b_c_name' ],
            where: { 
                deleted: 0,
            }
        }).then( rst => {
            console.log('rst::::');
            //console.log(rst);
            let jsonArr = new Array();
            for(let i=0; i<rst.length; i++){
                const boardCatId = rst[i].board_cat_id;
                const bcName = rst[i].b_c_name;
                const json = { 'bcId': boardCatId, 'bcName': bcName };
                jsonArr.push(json);
            }

            if( rst !== undefined ){
                res.json(jsonArr);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 게시판 리스트 */
const listBoard = async function(req, res){
    try {

        let bcId = req.query.bcId;
        console.log('게시판 리스트 bcId:::'+bcId);
        bcId = req.params.bcId;
        console.log('게시판 리스트 bcId:::'+bcId);

        let boardCatInfo = (await BoardCat.findAll({
            attributes: [ 'board_cat_id', 'b_c_name', 'write_auth', 'read_auth', 'update_auth', 'delete_auth' ],
            where: { 
                board_cat_id: bcId,
                deleted: 0,
            },
            raw: true
        }))[0];
        console.log('boardCatInfo:::');
        console.log(boardCatInfo);
        let readAuth = parseInt(boardCatInfo.read_auth);
        console.log('readAuth:::'+readAuth);

        let userId;
        if( req.user !== undefined ){   //임시 방편
            userId = req.user.user_id;
        }

        if( readAuth === 3 ){   //본인 작성글만 보이게

            let bInfo = (await Board.findAll({
                attributes: [ 'board_id', 'user_id', 'type', 'title', 'contents', 'id', 'name', 'views', 'hidden_status', [Sequelize.fn('date_format', Sequelize.col('reg_date'), '%Y.%m.%d %H:%i'), 'reg_date'] ],
                where: { 
                    board_cat_id: bcId,
                    user_id: userId,
                    title: { [Op.ne]: null },
                    deleted: 0,
                }
            }));

            let boardInfoArr = new Array();
            for(let i=0; i<bInfo.length; i++){
                const boardId = bInfo[i].board_id;
                const userId = bInfo[i].user_id;
                const type = bInfo[i].type;
                const title = bInfo[i].title;
                let contents = bInfo[i].contents;
                console.log('contents');
                console.log(contents);
                const id = bInfo[i].id;
                const name = bInfo[i].name;
                const views = bInfo[i].views;
                const hiddenStatus = bInfo[i].hidden_status;
                const regdate = bInfo[i].reg_date;

                //게시판 파일리스트
                let bFileInfo = (await BFile.findAll({
                    where: {
                        board_id: boardId,
                    },
                    raw: true,
                }));

                //console.log('bFileInfo');
                //console.log(bFileInfo);
                let bImg = null;
                let imgLeng = null;
                if( bFileInfo.length > 0 ){ //이미지가 있으면
                    let fileDir = bFileInfo[0].file_dir;
                    let fileName = bFileInfo[0].file_name;
                    bImg = fileDir+fileName;
                    imgLeng = bFileInfo.length;
                }

                //댓글 수
                let replyLeng = (await Reply.count({
                    where: {
                        board_id: boardId,
                    },
                    raw: true,
                }));

                const boardJson = { 'bId': boardId, 'uId':userId, 'type':type, 'title':title, 'contents':contents, 'id':id, 'name':name, 'views':views, 'hiddenStatus': hiddenStatus, 'regdate':regdate, 'bImg':bImg, 'imgLeng':imgLeng, 'replyLeng':replyLeng };
                boardInfoArr.push(boardJson);
            }
            //console.log(boardInfoArr);

            if( bInfo !== undefined ){
                Board.count({ 
                    where: { 
                        board_cat_id: bcId,
                        user_id: userId,
                        deleted: 0,
                    }
                }).then((totalCnt) => {
                    let json = { 'listInfo': boardInfoArr, 'totalCount': totalCnt };

                    res.json(json);
                });
            }
        }else {
            let bInfo = (await Board.findAll({
                attributes: [ 'board_id', 'user_id', 'type', 'title', 'contents', 'id', 'name', 'views', 'hidden_status', [Sequelize.fn('date_format', Sequelize.col('reg_date'), '%Y.%m.%d %H:%i'), 'reg_date'] ],
                where: { 
                    board_cat_id: bcId,
                    title: { [Op.ne]: null },
                    deleted: 0,
                }
            }))

            let boardInfoArr = new Array();
            for(let i=0; i<bInfo.length; i++){
                const boardId = bInfo[i].board_id;
                const userId = bInfo[i].user_id;
                const type = bInfo[i].type;
                const title = bInfo[i].title;
                let contents = bInfo[i].contents;
                //console.log('contents');
                //console.log(contents);
                let img_tag = /<IMG(.*?)>/gi;   //이미지 태그 정규식
                //contents = contents.replace(img_tag, "");   //이미지 태그 삭제
                //let empty_ptag = /<p></p>/gi;   //이미지 태그 정규식
                let tag = /(<([^>]+)>)/gi;  //태그 정규식
                if( contents !== null ){
                    contents = contents.replace(tag, "");   //태그 삭제
                }
                const id = bInfo[i].id;
                const name = bInfo[i].name;
                const views = bInfo[i].views;
                const hiddenStatus = bInfo[i].hidden_status;
                const regdate = bInfo[i].reg_date;

                //게시판 파일리스트
                let bFileInfo = (await BFile.findAll({
                    where: {
                        board_id: boardId,
                    },
                    raw: true,
                }));

                //console.log('bFileInfo');
                //console.log(bFileInfo);
                let bImg = null;
                let imgLeng = null;
                if( bFileInfo.length > 0 ){ //이미지가 있으면
                    let fileDir = bFileInfo[0].file_dir;
                    let fileName = bFileInfo[0].file_name;
                    bImg = fileDir+fileName;
                    imgLeng = bFileInfo.length;
                }

                //댓글 수
                let replyLeng = (await Reply.count({
                    where: {
                        board_id: boardId,
                    },
                    raw: true,
                }));

                //console.log('replyLeng:::'+replyLeng);
                
                const boardJson = { 'bId': boardId, 'uId': userId, 'type':type, 'title':title, 'contents':contents, 'id':id, 'name':name, 'views':views, 'hiddenStatus':hiddenStatus, 'regdate':regdate, 'bImg':bImg, 'imgLeng':imgLeng, 'replyLeng':replyLeng };
                boardInfoArr.push(boardJson);
            }
            //console.log(boardInfoArr)
            if( bInfo !== undefined ){

                Board.count({ 
                    where: { 
                        board_cat_id: bcId,
                        deleted: 0,
                    }
                }).then((totalCnt) => {
                    let json = { 'listInfo': boardInfoArr, 'totalCount': totalCnt };

                    res.json(json);
                });
            }
        }
        
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 id insert */
const insertBoardId = function(req, res){
    try {
        let boardCatId = req.body.bcId;
        boardCatId = req.params.bcId;
        let userId;
        if( req.user !== undefined ){   //임시 방편
            userId = req.user.user_id;
        }

        Board.create({
            board_cat_id: boardCatId,
            user_id: userId,
            //reg_data: '',
        }).then( rst => {
            console.log('rst::::');
            let bId = rst.board_id;
            //let json = { 'boardId':boardId };

            if( rst !== undefined ){
                res.json(bId);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 등록 */
const insertBoard = function(req, res){
    try {
        const boardId = req.body.bId;
        let type = req.body.type;
        if( type === '' ){
            type = null;
        }
        const title = req.body.title;
        const contents = req.body.contents;
        const hiddenStatus = req.body.hiddenStatus;
        console.log('title:::'+title);
        console.log('contents:::'+contents);
        console.log('hiddenStatus:::'+hiddenStatus);
        let id;
        let name;
        if( req.user !== undefined ){   //임시 방편
            id = req.user.id;
            name = req.user.name;
        }
        let ip = (req.headers['x-forwarded-for'] || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress || 
                req.connection.socket.remoteAddress).split(",")[0];
        if( ip.length < 15 ){
            ip = ip;
        }else {
            ip = ip.slice(7);
        }

        Board.update({
            type: type,
            title: title,
            contents: contents,
            id: id,
            name: name,
            ip: ip,
            hidden_status: hiddenStatus,
            //reg_data: '',
        }, {
            where: { board_id: boardId },
        }).then( rst => {
            console.log('rst::::');
            console.log(rst);
            console.log(rst.board_id);
            let boardCatId = rst.board_cat_id;
            let boardId = rst.board_id;
            let json = { 'bcId':boardCatId, 'bId':boardId };

            if( rst !== undefined ){
                res.json(json);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 게시글 작성 페이지 벗어날시 board 빈 데이터 삭제 */
const deleteEmptyBoard = function(req, res){
    try {

        //console.log(req.body);
        let boardId = req.body.bId;
        console.log('삭제할 bId:::'+bId);
        Board.destroy({
            where: { board_id: boardId }
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

/* 게시글 상세 페이지 */
const selectBoardById = function(req, res){
    try {

        //console.log(req.body);
        //let boardId = req.query.bId;
        let boardId = req.params.bId;
        console.log('boardId:::'+boardId);
        Board.findOne({
            where: { 
                board_id: boardId 
            }
        }).then( rst => {
            console.log('rst::::');
            //console.log(rst);

            const user_id = rst.user_id; 
            const id = rst.id;
            const type = rst.type;
            const title = rst.title;
            const contents = rst.contents;
            const views = rst.views;
            const hiddenStatus = rst.hidden_status;
            const regdate = rst.reg_date;
            const json = { 'uId':user_id, 'id':id, 'type':type, 'title':title, 'contents':contents, 'views':views, 'hiddenStatus':hiddenStatus, 'regdate':regdate };

            if( rst !== undefined ){
                res.json(json);
            }

        }).catch( err => {
            console.log('err::::');
            console.log(err);
        });
    }catch(err) {
        console.log(err);
    }
}

/* 조회수 증가 */
const updateViews = async function(req, res){
    try {

        console.log('조회수 증가');
        let boardId = req.body.bId;
        console.log('boardId:::'+boardId);
        let views = (await Board.findOne({
            attributes: [ 'views' ], 
            where: { 
                board_id: boardId 
            },
            raw: true
        })).views;
        console.log('views:::'+views);

        Board.update({
            views: views + 1
        },{
            where: { 
                board_id: boardId 
            }
        }).then( rst => {

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

/* 게시글 수정 */
const updateBoard = function(req, res){
    try {
        //let boardId = req.body.bId;
        let boardId = req.params.bId;
        let type = req.body.type;
        if( type === '' ){
            type = null;
        }
        let title = req.body.title;
        let contents = req.body.contents;
        let hiddenStatus = req.body.hiddenStatus;

        Board.update({
            type: type,
            title: title,
            contents: contents,
            hidden_status: hiddenStatus,
            mod_date: new Date(),
        }, {
            where: { board_id: boardId },
        }).then( rst => {
            console.log('rst::::');
            console.log(rst);
            console.log(rst.board_id);
            let boardId = rst.board_id;
            //let json = { 'boardId':boardId };

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

/* 게시글 삭제 */
const deleteBoard = function(req, res){
    try {
        //let boardId = req.body.bId;
        let boardId = req.params.bId;

        Board.update({
            deleted: 1,
            del_date: new Date(),
        }, {
            where: { board_id: boardId },
        }).then( rst => {
            console.log('rst::::');
            console.log(rst);
            console.log(rst.board_id);
            let boardId = rst.board_id;
            //let json = { 'boardId':boardId };

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
    listBoardCat: listBoardCat,
    listBoard: listBoard,
    insertBoardId: insertBoardId,
    insertBoard: insertBoard,
    deleteEmptyBoard: deleteEmptyBoard,
    selectBoardById: selectBoardById,
    updateViews: updateViews,
    updateBoard: updateBoard,
    deleteBoard: deleteBoard,
};