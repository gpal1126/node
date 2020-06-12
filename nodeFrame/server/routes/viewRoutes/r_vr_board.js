var express = require('express');
var router = express.Router();

const { BoardCat } = require('../../models');  //스키마 연결
const { Board } = require('../../models');  //스키마 연결

const fs =require('fs');  //파일 관련 모듈

const mdlwrLogged = require('../../passport/mdlwrLogged');

/***
    관리 권한의 경우
    읽기 권한 : 스태프 이상 등급
    쓰기/수정 권한 : 담당자 이상 등급
***/

/* GET users listing. */
router.get('/:bType/:bcId', async function(req, res, next){    //로그인 여부에 따라 접근 가능한 페이지 미들웨어 func

    //세션 체크
    mdlwrLogged.sessionChk(req, res, next);

    const urlParamId = req.params.bType;  //넘어온 url id    
    console.log('로그인 여부에 따라 접근 가능한 페이지 미들웨어 func');
    console.log('urlParamId:::'+urlParamId);

    let userType;   //유저 타입(0: 회원, 1: 관리자)
    let userId;     //유저 인덱스
    if( req.user ){   //임시 방편
        userId = parseInt(req.user.user_id);
        userType = parseInt(req.user.user_type);
    }
    console.log('userType::::'+userType);

    let boardCatId = parseInt(req.query.bcId);
    boardCatId = parseInt(req.params.bcId);

    //board user id
    let bUId;
    //숨김 여부
    let hiddenStatus;
    if( req.cookies.bId ){
        const boardId = req.cookies.bId;
        console.log('boardId:::'+boardId);
    
        //게시글 정보    
        boardInfo = (await Board.findAll({
            attributes: ['user_id', 'hidden_status'],
            where: {
                board_id: boardId
            },
            raw: true
        }))[0];
    
        bUId = boardInfo.user_id;
        hiddenStatus = boardInfo.hidden_status;
    }
    console.log('boardInfo:::');
    console.log('bUId:::'+bUId);
    console.log('hiddenStatus:::'+hiddenStatus);

    BoardCat.findOne({
        where: {
            board_cat_id: boardCatId
        },
        
    }).then( (rst) => {
        console.log('rst::::');
        //console.log(rst)
        var boardCatId = parseInt(rst.board_cat_id);
        console.log('boardCatId:::'+boardCatId);
        const bcName = rst.b_c_name;
        const writeAuth = parseInt(rst.write_auth);
        const readAuth = parseInt(rst.read_auth);
        const updateAuth = parseInt(rst.update_auth);
        const deleteAuth = parseInt(rst.delete_auth);
        const hideContsType = parseInt(rst.hide_conts_type);
        const replyType = parseInt(rst.reply_type);
        const reReplyType = parseInt(rst.re_reply_type);
        const regdate = rst.reg_date;
        
        //리스트 
        if( urlParamId == 'list' ){
            if( readAuth === 3 ){ //본인
                //로그인 체크
                if( !req.user ){
                    mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
                }else {
                    next();
                }
            }else {
                mdlwrLogged.allLogged(req, res, next); //모두 접근 가능
            }
        }

        //작성 페이지 쓰기 권한
        if( urlParamId === 'writeBoard' ){
            if(writeAuth === 0 ){ //전체(회원)
                console.log('회원 접근')
                mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
            }else {
                console.log('담당자 이상 접근')
                mdlwrLogged.isManagerLoggedIn(req, res, next); //담당자 로그인 된 경우에만 접근 가능한 미들웨어
            }
        }

        //상세페이지 읽기 권한
        if( urlParamId === 'detail' ){

            //비밀글이면
            if( hiddenStatus === 1 ){
                if( userId === bUId || ['s', 'm', 'a'].includes(userType) ){  //작성자나 관리자이면 통과
                    next();
                }else { //작성자 또는 관리자가 아니면
                    res.send("<script>alert('작성자와 관리자만 접근 가능합니다.'); history.back();</script>");
                }
            }else { //비밀글이 아니면
                if(readAuth === 0 ){ //전체(비회원)
                    console.log('전체(비회원) 접근')
                    mdlwrLogged.allLogged(req, res, next); //모두 접근 가능
                }else if( readAuth === 1 ){
                    console.log('스태프 이상 접근')
                    mdlwrLogged.isStaffLoggedIn(req, res, next); //스태프 이상 로그인 된 경우에만 접근 가능한 미들웨어
                }else if( readAuth === 2 ){
                    console.log('회원 접근');
                    mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
                }else if( readAuth === 3 ){ //본인
                    //로그인 체크
                    if( !req.user ){
                        mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
                    }else {
                        console.log('userId:::'+userId);
                        console.log('bUId:::'+bUId);
        
                        if( userId !== bUId ){
                            res.send("<script>alert('작성자만 접근 가능합니다.'); history.back();</script>");
                        }else {
                            next();
                        }
                    }
                }
            }

        }

        //수정페이지 수정 권한
        if( urlParamId === 'modifyBoard' ){
            if( updateAuth === 0 ){ //전체(회원)
                console.log('전체(회원) 접근')
                mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
            }else if( updateAuth === 1 ){
                console.log('담당자 이상 접근')
                mdlwrLogged.isManagerLoggedIn(req, res, next); //담당자 이상 로그인 된 경우에만 접근 가능한 미들웨어
            }else if( updateAuth === 2 ){ //본인

                //로그인 체크
                if( !req.user ){
                    mdlwrLogged.isLoggedIn(req, res, next); //로그인 된 경우에만 접근 가능한 미들웨어
                }else {
                    console.log('userId:::'+userId);
                    console.log('bUId:::'+bUId);
    
                    if( userId !== bUId ){
                        res.send("<script>alert('작성자만 접근 가능합니다.'); history.back();</script>");
                    }else {
                        next();
                    }
                }

            }
        }
            
    }).catch( err => {
        console.log('err::::');
        console.log(err);
    });

}, function(req, res) {
    const urlParamId = req.params.bType;  //넘어온 url id
    const bcId = req.params.bcId;  //넘어온 url id
    console.log('페이지 이동 func');
    console.log('urlParamId:::'+urlParamId);
    console.log('bcId:::'+bcId);

    let deviceType = req.device.type.toUpperCase(); //device type
    console.log('deviceType::::::::::::::::::::::::::::::::::::::'+deviceType);
    if( deviceType === 'DESKTOP' ){
        deviceType = 'web';
    }else if( ['TABLET', 'PHONE'].includes(deviceType) ){
        //deviceType = 'mobile';  //mobile 제작할시 사용
        deviceType = 'web';
    }else {
        deviceType = 'web';
    }//if

    
    let fileName;               //파일명

    //객체 리터럴로 urlParamId 값과 파일명 매핑
    const objUrlId = {
        'list' : 'b_list_board',              //게시판 리스트
        'writeBoard' : 'b_write_board',             //게시판 쓰기
        'detail' : 'b_detail_board',             //유저 가입 페이지
        'modifyBoard' : 'b_modify_board',             //유저 가입 페이지
    }

    //Object.entries(objUrlId) : 객체 -> 배열
    fileName = Object.entries(objUrlId).find(function(v){   //객체를 배열로 변환하여 찾음
        console.log(v[0]);    //index 0은 urlParamId
        //console.log(v[1]);    //index 1은 파일명
        return v[0] == urlParamId;  //배열 값과 넘어온 urlParamId 값과 비교
    })[1];

    console.log('fileName:::'+fileName);

    const readFileUrl = `views/${deviceType}/board/${fileName}.html`;
    
    fs.readFile(readFileUrl, function(err, data){
        res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
        res.end(data);
    });
});

module.exports = router;
