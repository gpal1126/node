$(function(){

    let bcId = parseInt(getUrlParameter('bcId'));
    console.log('bcId:::'+bcId);
    let url = '/admin/d_board_cat/selectBoardByBCId';
    let json = { 'bcId': bcId };
    let data = json;
    let boardCatInfo = ajax.readData(url, data);
    console.log(boardCatInfo);
    let bcName = boardCatInfo.bcName;
    let writeAuth = parseInt(boardCatInfo.writeAuth);
    console.log('writeAuth:::'+writeAuth);

    let userInfo = getCookie('u_info');
    console.log(userInfo)
    let uType;
    let sUId;
    if( userInfo !== '' ){
        userInfo = JSON.parse(decodeURI(decodeURIComponent(userInfo)));
        uType = userInfo.type;
        sUId = userInfo.id;
    }

    console.log('uType:::'+uType);
    
    if( writeAuth === 0 && uType !== undefined ){    //일반 유저 쓰기 허용
        console.log('일반유저');
        $('.board-list .btn-box').html('<button class="btn-board" id="writeBtn">글쓰기</button>');
    }else if( writeAuth === 1 && ( uType === 'm' || uType === 'a' ) ){    //관리자만 쓰기 허용
        console.log('관리자');
        $('.board-list .btn-box').html('<button class="btn-board" id="writeBtn">글쓰기</button>');
    }

    let updateAuth = parseInt(boardCatInfo.updateAuth);
    let deleteAuth = parseInt(boardCatInfo.deleteAuth);
    let hideContsType = parseInt(boardCatInfo.hideContsType);
    let replyType = parseInt(boardCatInfo.replyType);
    let reReplyType = parseInt(boardCatInfo.reReplyType);

    $('.b-title').html(bcName);

    url = '/d_board/listBoard';
    json = { 'bcId': bcId };
    data = json;
    let listRst = ajax.readData(url, data);
    console.log(listRst);
    let listInfo = listRst.listInfo;
    let totalCnt = listRst.totalCount;

    let btopHtml = '';
    switch( bcId ){
        case 1:
            btopHtml += ''+
                        '<div class="cnt-box">총 <span id="cnt"></span>개의 글</div>'+
                        '<div class="t-txt">'+
                        '    택배 수령 후 2주 안에 작성하고 <span class="coupon">할인쿠폰</span> 받으세요.'+
                        '</div>';
            $('.b-top-row').append(btopHtml);
            $('.b-top-row #cnt').text(totalCnt);

            $('.board-list #writeBtn').attr('class', 'review-btn');
            $('.board-list #writeBtn').html('후기 작성하기');
            break;
        case 2:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            //$('.board-box .regdate').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            
            break;
        case 3:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            break;
        case 4:
            btopHtml += ''+
                        '<div class="t-title">어떤 도움이 필요하신가요?</div>'+
                        '<div class="search-row">'+
                        '    <span class="search-icon"><img src="/images/common/icon/search.svg" /></span>'+
                        '    <input type="text" class="search-txt" id="searchTxt" placeholder="예) 배송비 결제, 비용"/>'+
                        '</div>'+
                        '<div class="type-row">'+
                        '    <span class="btype actived" id="all">전체</span>'+
                        '    <span class="btype" id="1">배송/구매대행</span>'+
                        '    <span class="btype" id="2">결제</span>'+
                        '    <span class="btype" id="3">통관</span>'+
                        '    <span class="btype" id="4">회원정보</span>'+
                        '</div>';
            $('.b-top-row').append(btopHtml);
            
            break;
        case 5:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            break;
        default:
            break;
    }

    let tbody='';
    if( totalCnt === 0 ){
        tbody += ''+
                '<tr class="nodata">'+
                '   <td colspan="5">데이터가 없습니다.</td>'+
                '</tr>';
        $('.board-box tbody').html(tbody);
    }else {
        for(let i=0; i<listInfo.length; i++){
            i = parseInt(i);
            let bId = listInfo[i].bId;
            let uId = listInfo[i].uId;
            let title = listInfo[i].title;
            let id = listInfo[i].id;
            let name = listInfo[i].name;
            let views = listInfo[i].views;
            let hiddenStatus = listInfo[i].hiddenStatus;
            if( hiddenStatus === 0 ){  //공개글
                title = title;
            }else { //비밀글
                if( sUId === uId || ( uType === 'm' || uType === 'a' ) ){
                    title = '<span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;'+title;
                }else {
                    title = '<span class="lock-img"><img src="/images/web/board/lock.png"/></span>&nbsp;비밀글입니다.';
                }
            }
            let regdate = listInfo[i].regdate;
            tbody += ''+
                '<tr class="data" id="data'+(i+1)+'">'+
                '   <input type="hidden" id="bId'+(i+1)+'" value="'+bId+'">'+
                '   <input type="hidden" id="hiddenStatus'+(i+1)+'" value="'+hiddenStatus+'">';
            tbody += ''+
            '   <td class="no">'+(i+1)+'</td>';

            tbody += ''+
                '   <td class="title">'+title+'</td>';

            tbody += ''+    
                '   <td class="id">'+id+'</td>';

            tbody += ''+
                '   <td class="regdate">'+regdate+'</td>';

            tbody += ''+
                '   <td class="views">'+views+'</td>';

            tbody += ''+    
                '</tr>';
        }
        $('.board-box tbody').html(tbody);
    }

    switch( bcId ){
        case 1: //이용후기는 다시 그려줌
            $('.board-box').remove();   //초기화
            let rboardHtml = '';
            for(let i=0; i<listInfo.length; i++){
                let rtype = listInfo[i].type;
                let rtypeTxt;
                if( rtype === 1 ){
                    rtypeTxt = '구매대행';
                }else {
                    rtypeTxt = '배송대행';
                }
                let rtitle = listInfo[i].title;
                let rcontents = listInfo[i].contents;
                let regdate = listInfo[i].regdate;
                let id = listInfo[i].id;
                console.log(id)
                id = textLengthOverCut(id, 4, '*');
                let replyLeng = listInfo[i].replyLeng;
                let bImg = listInfo[i].bImg;
                let imgLeng = listInfo[i].imgLeng;
                rboardHtml += ''+
                            '<div class="review-box">'+
                            '    <div class="left-box">'+
                            '        <div class="review-type" id="rtype">'+rtypeTxt+'</div>'+
                            '        <div class="review-title" id="rtitle">'+rtitle+'</div>'+
                            '        <div class="review-contents" id="rcontents">'+rcontents+'</div>'+
                            '        <div class="bottom-row">'+
                            '            <span class="regdate" id="regdate">'+regdate+'</span>'+
                            '            <span class="id" id="id">'+id+'</span>'+
                            '            <div class="reply-box" id="reply-box">'+
                            '                <span class="reply-icon"><img src="/images/common/icon/review.svg"/></span>'+
                            '                <span class="reply-cnt">'+replyLeng+'</span>'+
                            '            </div>'+
                            '        </div>'+
                            '    </div>';
                if( imgLeng > 0 ){
                    rboardHtml += ''+
                                '    <div class="right-box">'+
                                '        <div class="review-img-box">'+
                                '           <div class="review-img" style="background-image: url('+bImg+');" ></div>'+
                                '           <span class="img-leng" id="imgLeng">'+imgLeng+'</span>'+
                                '       </div>'+
                                '    </div>';
                }
                rboardHtml += ''+                            
                            '</div>';
            }
            $('.board-list').prepend(rboardHtml);
            
            break;
        case 2:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            //$('.board-box .regdate').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            
            break;
        case 3:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            break;
        case 4:
            $('.board-box .id').addClass('novisible');
            $('.board-box .regdate').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            break;
        case 5:
            $('.board-box .type').addClass('novisible');
            $('.board-box .id').addClass('novisible');
            $('.board-box .views').addClass('novisible');
            break;
        default:
            break;
    }
    /* if( bcId === 1 ){   
        //$('.board-box .regdate').addClass('novisible');
        //$('.board-box .id').addClass('novisible');
        $('.board-box .views').addClass('novisible');
        
    }else if( bcId === 2 ){
        //$('.board-box .regdate').addClass('novisible');
        $('.board-box .id').addClass('novisible');
        $('.board-box .views').addClass('novisible');
        
    }else if( bcId === 3 ){
        $('.board-box .id').addClass('novisible');
        $('.board-box .views').addClass('novisible');

    }else if( bcId === 3 ){
        $('.board-box .id').addClass('novisible');
        $('.board-box .views').addClass('novisible');

    } */

    /* 게시글 상세 페이지 이동 */
    $('.data').on('click', function(){
        const id = $(this).attr('id').split('_')[1];
        const hiddenStatus = parseInt($(this).children('#hiddenStatus'+id).val());
        if( hiddenStatus === 1 ){
            alert('작성자와 관리자만 볼 수 있는 글입니다.');
            return false;
        }else {
            const no = $(this).children('.no').html();
            const bId = $('#bId'+no).val();
            setCookie('bcId', bcId);
            setCookie('bId', bId);
            location.href = '/board/detail?bcId='+bcId;
        }
    });

    /* 글쓰기 */
    $('#writeBtn').on('click', function(){
        setCookie('bcId', bcId);
        location.href = '/board/writeBoard?bcId='+bcId;
    });
});