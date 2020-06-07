$(function(){

    let userInfo = getCookie('u_info');
    let uType;
    let sUId;
    if( userInfo ){
        userInfo = JSON.parse(decodeURI(decodeURIComponent(userInfo)));
        uType = userInfo.type;
        console.log('uType:::'+uType);
        sUId = userInfo.id;
        console.log('sUId:::'+sUId);
    }

    let bcId = getUrlParameter('bcId');
    console.log('bcId:::'+bcId)
    let url = '/admin/d_board_cat/selectBoardByBCId';
    let json = { 'bcId': bcId };
    let data = json;
    let boardCatInfo = ajax.readData(url, data);
    console.log(boardCatInfo)
    let bcName = boardCatInfo.bcName;
    $('.title').html(bcName);

    let bId = getCookie('bId');

    /* 조회수 증가 */
    url = '/d_board/increaseViews';
    json = { 'bId':bId };
    data = json;
    //잠시 주석
    //ajax.updateData(url, data);

    /* 게시글 조회 */
    url = '/d_board/detailBoard';
    json = { 'bId':bId };
    data = json;
    let boardInfo = ajax.readData(url, data);
    console.log(boardInfo);
    let uId = boardInfo.uId;
    let id = boardInfo.id;
    let title = boardInfo.title;
    let contents = boardInfo.contents;
    let hiddenStatus = boardInfo.hiddenStatus;
    $('#name').html(id);
    if( hiddenStatus === 0 ){
        $('#title').html(title);
    }else if( hiddenStatus === 1 ){
        $('#title').html('<span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;'+title);
    }
    $('.detail').html(contents);
    console.log('uId:::'+uId)
    console.log('sUId:::'+sUId)
    if( uId === sUId ){ //글을 작성한 유저만 수정 버튼 보이게
        btnHtml = ''+
            '<button class="btn-board btn bg-primary" id="modifyBtn">수정</button>'+
            '&nbsp;'+
            '<button class="btn-board btn bg-dark" id="deleteBtn">삭제</button>';
        $('.board-form .btn-box').prepend(btnHtml);
    }

    /* 수정 버튼 클릭 */
    $('#modifyBtn').on('click', function(){
        location.href = '/board/modifyBoard?bcId='+bcId;
    });

    /* 삭제 버튼 클릭 */
    $('#deleteBtn').on('click', function(){
        if( confirm('게시글을 삭제하시겠습니까?') ){
            url = '/d_board/deleteBoard';
            json = { 'bId':bId };
            data = json;
            let boardInfo = ajax.deleteData(url, data);
            if( boardInfo === 1 ){
                location.href = '/board/list?bcId='+bcId;
            }
        }else {
            return false;
        }
    });

    /* 목록 버튼 클릭 */
    $('#listBtn').on('click', function(){
        location.href = '/board/list?bcId='+bcId;
    });

    /*** 댓글 여부 ***/
    let replyType = boardCatInfo.replyType;
    if( replyType === '1' ){
        
        $('.board-line').css({'display':'block'});
        $('.reply-form').css({'display':'block'});
        
        /* 댓글 */
        var pageNum = 1; //현재 페이지
        
        printReplyList(pageNum);
    }else {
        $('.board-line').css({'display':'none'});
        $('.reply-form').css({'display':'none'});
    }
    /*** 댓글 여부 ***/
    
    /* 페이징 버튼 클릭시 */
    $('.paging-box').on('click', '.first-btn, .prev-btn, .page, .next-btn, .end-btn', function(){
        //현재 페이지
        var pageNum = parseInt($(this).attr('id'));
        console.log('pageNum:::'+pageNum);
        //list 
        printReplyList(pageNum);

        //맨 위로 이동
        $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
    });

    function printReplyList(pageNum){

        var pageRecordSize = 10; //하나의 페이지당 출력컬럼수
    
        json = { 'bId': bId, 'pageNum':pageNum, 'pageRecordSize':pageRecordSize };
        url = '/d_reply/selectList';
        type = 'GET';
        data = json;
        dataType = 'json';
        let replyJson = ajax.readData(url, data);
        let replyList = replyJson.rst;
        let totalCnt = parseInt(replyJson.totalCnt);
        let sessionId = replyJson.sessionId;
        console.log('sessionId:::'+sessionId);
    
        //페이징 처리
        pagination(pageNum, pageRecordSize, totalCnt);
        
        $('.reply-title-box .total-cnt').html(totalCnt);
        if( replyList !== null ){
            console.log(replyList);
            $('.reply-conts-box').empty();
            for(let i=0; i<replyList.length; i++){
                i = parseInt(i);
                let rId = replyList[i].rId;
                let pId = replyList[i].pId;
                let uId = replyList[i].uId;
                let replyOrder = replyList[i].replyOrder;
                let contents = replyList[i].contents;
                let id = replyList[i].id;
                let replyCnt = replyList[i].replyCnt;
                let hiddenStatus = parseInt(replyList[i].hiddenStatus);
                console.log('hiddenStatus:::'+hiddenStatus);
                let regdate = replyList[i].regdate;
                let reReplyCnt = replyList[i].reReplyCnt;

                let appendHtml = 
                    '<div class="reply-conts" id="replyConts'+(i+1)+'">'+
                    '    <input type="hidden" id="replyId'+(i+1)+'" value="'+rId+'"/>'+
                    '    <div class="reply-top">'+
                    '        <div class="left">'+
                    '            <span class="nickname">'+id+'</span>'+
                    '            <span class="regdate">'+regdate+'</span>'+
                    '        </div>';
                if( sessionId === uId ){
                    appendHtml += 
                    '       <div class="right">'+
                    '           <button class="mod-btn btn bg-white"><i class="pencil alternate icon"></i><span class="tooltiptext update-txt">수정</span></button>'+
                    '           <button class="del-btn btn bg-white"><i class="trash alternate outline icon"></i><span class="tooltiptext delete-txt">삭제</span></button>'+
                    '       </div>';
                    /* '       <div class="right">'+
                    '            <button class="mod-btn btn bg-white">수정</button>'+
                    '            <button class="del-btn btn bg-white">삭제</button>'+
                    '        </div>'; */
                }
                appendHtml += 
                    '    </div>';
                if( hiddenStatus === 0 ){
                    appendHtml +=    
                    '    <div class="reply-txt">'+contents+'</div>';
                }else {
                    if( uId === sessionId || uType === 'm' || uType === 'a' ){ //작성자와 관리자만
                    appendHtml +=    
                    '    <div class="reply-txt"><span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;'+contents+'</div>';
                    }else {
                    appendHtml +=    
                    '    <div class="reply-txt"><span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;비밀 댓글입니다.</div>';
                    }
                }

                /*** 대댓글 여부 ***/
                let reReplyType = boardCatInfo.reReplyType;
                if( reReplyType === '1' ){
                    appendHtml +=    
                        '    <button class="reReply-btn btn bg-white">답글 ';
                    if( reReplyCnt !== 0 ){
                    appendHtml +=        
                        '        <span class="reReply-total-cnt">'+reReplyCnt+'</span>';
                    }    
                    appendHtml +=        
                        '   </button>'+
                        '    <div class="reReply-box" id="reReplyBox'+(i+1)+'" style="display:none;">'+
                        '        <div class="reReply-list"></div>'+
                        '        <div class="reReply-write-box" id="reReplyWriteBox'+(i+1)+'">'+
                        '            <textarea class="reReply-write-txt"></textarea>'+ 
                        '            <div class="reReply-write-bottom">'+
                        '                <label><input type="checkbox" name="hiddenStatus" id="hiddenStatus"/> 숨김여부 </label>'+
                        '                <button class="btn re-write-btn" disabled="true">등록</button>'+
                        '            </div>'+
                        '        </div>'+
                        '    </div>'+
                        '</div>';
                }
                /*** 대댓글 여부 ***/

                appendHtml +=        
                        '<hr class="wrap-line" />';
    
                $('.reply-box .reply-conts-box').append(appendHtml);
            }
        }

        if( sessionId === undefined ){  //비로그인일 경우
            //댓글
            $('.write-txt').attr('placeholder', '로그인 후 이용해주세요.');
            $('.write-txt').prop('disabled', true);
            $('.write-box .write-btn').prop('disabled', true);
            
            //답글
            $('.reReply-write-box .reReply-write-txt').attr('placeholder', '로그인 후 이용해주세요.');
            $('.reReply-write-box .reReply-write-txt').prop('disabled', true);
            $('.reReply-write-box .re-write-btn').prop('disabled', true);
        }else { //로그인일 경우
            //댓글
            $('.write-txt').prop('disabled', false);
            $('.write-box .write-btn').prop('disabled', false);

            //답글
            $('.reReply-write-box .reReply-write-txt').prop('disabled', false);
            $('.reReply-write-box .re-write-btn').prop('disabled', false);
        }
    }
    /* 응원 댓글 */

    //댓글 등록하기
    $('.reply-box .write-btn').on('click', function(){
        const reply = $('.write-txt').val();
        
        if( reply === '' ){
            $('.write-txt').attr('placeholder', '댓글을 남겨주세요.');
            $('.write-txt').focus();
            return false;
        }
        const replyOrder = 0;
        let hiddenStatus = $('#hiddenStatus').is(':checked');
        if( hiddenStatus ){
            hiddenStatus = 1;
        }else {
            hiddenStatus = 0;
        }

        let json = { 'bId': bId, 'bcId': bcId, 'replyOrder': replyOrder, 'reply': reply, 'hiddenStatus':hiddenStatus };
        let url = '/d_reply/insertReply';
        let type = 'POST';
        let data = json;
        let dataType = 'json';
        let insertReply = ajaxFunc(url, type, data, dataType);
        console.log(insertReply);
        if( insertReply === 1 ){
            console.log('등록완료?')
            location.href = '/board/detail?bcId='+bcId;
        }
    });

    //답글 버튼 클릭
    $('.reply-conts-box').on('click', '.reReply-btn', function(){
        //답글 애니메이트
        $(this).next('.reReply-box').slideToggle();

        const idx = $(this).parents('.reply-conts').attr('id').split('replyConts')[1];
        const pId = $('#replyId'+idx).val();

        json = { 'pId': pId };
        url = '/d_reply/selectListReReply';
        type = 'GET';
        data = json;
        dataType = 'json';
        let reReplyInfo = ajax.readData(url, data);
        console.log(reReplyInfo);

        let reReplyList = reReplyInfo.rst;
        let totalCnt = parseInt(reReplyInfo.totalCnt);
        let sessionId = reReplyInfo.sessionId;
        console.log('sessionId:::'+sessionId);
    
        //$('.reply-title-box .total-cnt').html(totalCnt);
        
        if( reReplyList !== null ){
            console.log(reReplyList);

            $(this).next('.reReply-box').children('.reReply-list').empty()
            for(let i=0; i<reReplyList.length; i++){
                i = parseInt(i);
                let rId = reReplyList[i].rId;
                let pId = reReplyList[i].pId;
                let uId = reReplyList[i].uId;
                let replyOrder = reReplyList[i].replyOrder;
                let contents = reReplyList[i].contents;
                let id = reReplyList[i].id;
                let replyCnt = reReplyList[i].replyCnt;
                let hiddenStatus = parseInt(reReplyList[i].hiddenStatus);
                console.log('hiddenStatus:::'+hiddenStatus);
                let regdate = reReplyList[i].regdate;
    
                console.log('idx:::'+idx);
                let appendHtml = 
                    '<div class="reply-conts" id="replyConts'+idx+'_'+(i+1)+'">'+
                    '    <input type="hidden" id="replyId'+idx+'_'+(i+1)+'" value="'+rId+'"/>'+
                    '    <div class="reply-top">'+
                    '        <div class="left">'+
                    '            <span class="nickname">'+id+'</span>'+
                    '            <span class="regdate">'+regdate+'</span>'+
                    '        </div>';
                if( sessionId === uId ){
                    appendHtml += 
                    '       <div class="right">'+
                    '           <button class="mod-btn btn bg-white"><i class="pencil alternate icon"></i><span class="tooltiptext update-txt">수정</span></button>'+
                    '           <button class="del-btn btn bg-white"><i class="trash alternate outline icon"></i><span class="tooltiptext delete-txt">삭제</span></button>'+
                    '       </div>';
                    /* '       <div class="right">'+
                    '            <button class="mod-btn btn bg-white">수정</button>'+
                    '            <button class="del-btn btn bg-white">삭제</button>'+
                    '        </div>'; */
                }
                appendHtml += 
                    '    </div>';
                if( hiddenStatus === 0 ){
                    appendHtml +=    
                    '    <div class="reply-txt">'+contents+'</div>';
                }else {
                    if( uId === sessionId || uType === 'm' || uType === 'a' ){ //작성자와 관리자만
                    appendHtml +=    
                    '    <div class="reply-txt"><span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;'+contents+'</div>';
                    }else {
                    appendHtml +=    
                    '    <div class="reply-txt"><span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;비밀 댓글입니다.</div>';
                    }
                }
                appendHtml +=    
                    '</div>'+
                    '<hr class="reReply-line" />';
    
                //$('#reReplyBox'+id+' .reReply-list').append(appendHtml);
                $(this).next('.reReply-box').children('.reReply-list').append(appendHtml);
            }
        }

    });

    //답글 등록 
    $('.reply-conts-box').on('click', '.re-write-btn', function(){
        const id = $(this).parents('.reply-conts').attr('id').split('replyConts')[1];
        console.log('id:::'+id);

        const pId = $('#replyId'+id).val();
        console.log('pId:::'+pId);

        const reply = $('#reReplyWriteBox'+id+' .reReply-write-txt').val();
        console.log('reply:::'+reply);
        
        if( reply === '' ){
            $('#reReplyWriteBox'+id+' .reReply-write-txt').attr('placeholder', '댓글을 남겨주세요.');
            $('#reReplyWriteBox'+id+' .reReply-write-txt').focus();
            return false;
        }
        const replyOrder = 1;
        let hiddenStatus = $('#reReplyBox'+id+' #hiddenStatus').is(':checked');
        if( hiddenStatus ){
            hiddenStatus = 1;
        }else {
            hiddenStatus = 0;
        }

        let json = { 'pId':pId, 'bId': bId, 'bcId': bcId, 'replyOrder': replyOrder, 'reply': reply, 'hiddenStatus':hiddenStatus };
        let url = '/d_reply/insertReply';
        let data = json;
        let insertReply = ajax.createJsonData(url, data);
        console.log(insertReply);
        if( insertReply === 1 ){
            console.log('등록완료?')
            location.href = '/board/detail?bcId='+bcId;
        }
    });

    /* 댓글 수정 팝업 띄우기 */
    $('.reply-conts-box').on('click', '.reply-conts .mod-btn', function(){

        //맨 위로 이동
        //$( 'html, body' ).animate( { scrollTop : 0 }, 400 );
        //const id = $(this).parent().attr('id').split('btnBox')[1];
        const id = $(this).parents('.reply-conts').attr('id').split('replyConts')[1];
        console.log('id:::'+id);
        const contents = $('#replyConts'+id+' .reply-txt').html();
        const rId = $('.reply-conts #replyId'+id).val();
        console.log('rId:::'+rId);

        $('.reply-box .reply-popup').remove();
        let popup = ''+
            '<div class="reply-back"></div>'+
            '<div class="reply-popup">'+
            '    <input type="hidden" id="replyId" value="'+rId+'">'+
            '    <div class="r-title">댓글 수정하기</div>'+
            '    <div class="write-box">'+
            '        <textarea class="write-txt">'+contents+'</textarea>'+
            '        <div class="btn-box">'+
            '            <button class="cancel-btn btn bg-secondary">취소</button>'+
            '            <button class="mod-btn btn btn-primary">수정</button>'+
            '       </div>'+
            '    </div>'+
            '</div>';
        $('.reply-box').append(popup);
    });

    /* 댓글 삭제 */
    $('.reply-conts-box').on('click', '.reply-conts .del-btn', function(){
        const id = $(this).parents('.reply-conts').attr('id').split('replyConts')[1];
        console.log('id:::'+id);
        const rId = $('.reply-conts #replyId'+id).val();
        console.log('rId:::'+rId);

        if( confirm('댓글을 삭제하시겠습니까?') ){
            let json = { 'rId': rId };
            let url = '/d_reply/deleteReply';
            let data = json;
            let deleteReply = ajax.deleteData(url, data);
            console.log(deleteReply);
            if( deleteReply === 1 ){
                console.log('삭제완료?')
                location.href = '/board/detail?bcId='+bcId;
            }
        }else {
            return false;
        }
    });

    /* 댓글 수정 */
    $('.reply-box').on('click', '.reply-popup .mod-btn', function(){
        const rId = $('.reply-popup #replyId').val();
        const reply = $('.reply-popup .write-txt').val();
        //console.log(typeof reply);
        console.log(reply);
        
        if( reply === '' ){
            $('.reply-popup .write-txt').attr('placeholder', '깨끗한 댓글을 남겨주세요.');
            $('.reply-popup .write-txt').focus();
            return false;
        }
        let json = { 'rId': rId, 'reply': reply };
        let url = '/d_reply/updateReply';
        let data = json;
        let updateReply = ajax.updateData(url, data);
        console.log(updateReply);
        if( updateReply === 1 ){
            console.log('수정완료?')
            location.href = '/board/detail?bcId='+bcId;
        }
    });

    /* 팝업 창 닫기 */
    $('.reply-box').on('click', '.reply-popup .cancel-btn', function(){
        $('.reply-back').remove();
        $('.reply-popup').remove();
    });

});