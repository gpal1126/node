$(function(){
//$(document).ready(function(){
//window.addEventListener('load', function(){
//window.onload=function() {
    //$('.header-html').load("/views/web/common/header.html");
    //$('.u-sidemenu-html').load("/views/web/common/u_sidemenu.html");
    
    let bcId = getUrlParameter('bcId');
    
    let url = '/d_board/listBoardCat';
    let data;
    let listRst = ajax.readData(url, data);
    console.log(listRst)
    let boardCatHtml='';
    for(let i=0; i<listRst.length; i++){
        let bcId = listRst[i].bcId;
        let bcName = listRst[i].bcName;
        
        //boardCatHtml += '<span class="b-item" id="bcId_'+bcId+'"><a href="/board/list?bcId='+bcId+'">'+bcName+'</a></span>';
        boardCatHtml = '<a href="/board/list/'+bcId+'">'+bcName+'</a>';
        $('.b-nav #bcId_'+bcId).append(boardCatHtml);
    }
    //$('.b-nav').html(boardCatHtml);
    
    $('#bcId_'+bcId).addClass('actived'); 
    

    let userInfo = getCookie('u_info');
    if( !userInfo ){  //로그아웃 상태
        console.log('로그아웃 상태');
    
    }else { //로그인 상태
        console.log('로그인 상태');
        userInfo = JSON.parse(decodeURI(decodeURIComponent(userInfo)));
        let userType = userInfo.type;
        console.log('userType:::'+userType);
        let userId = userInfo.id;
        console.log('userId:::'+userId);
        
        
    }

    /* let json = '';
    const url = '/d_users/selectUserInfoById';
    const type = 'GET';
    const data = json;
    const dataType = 'json';

    userInfoRst = ajaxFunc(url, type, data, dataType);
    console.log(userInfoRst)
    if( userInfoRst === 0 ){    //로그아웃 상태
        $('.header-menu .login-box').css({'display': 'none'});
        $('.header-menu .logout-box').css({'display': ''});

        $('.side-menu-body .login-box').css({'display': 'none'});
        $('.side-menu-body .logout-box').css({'display': ''});
    }else { //로그인 상태
        $('.header-menu .login-box').css({'display': ''});
        $('.header-menu .logout-box').css({'display': 'none'});

        $('.side-menu-body .login-box').css({'display': ''});
        $('.side-menu-body .logout-box').css({'display': 'none'});
    }  */

   /*  $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: function(rst){
            console.log(rst);
            if( rst === 0 ){    //로그아웃 상태
                $('.header-menu .login-box').css({'display': 'none'});
                $('.header-menu .logout-box').css({'display': ''});

                $('.side-menu-body .login-box').css({'display': 'none'});
                $('.side-menu-body .logout-box').css({'display': ''});
            }else { //로그인 상태
                $('.header-menu .login-box').css({'display': ''});
                $('.header-menu .logout-box').css({'display': 'none'});

                $('.side-menu-body .login-box').css({'display': ''});
                $('.side-menu-body .logout-box').css({'display': 'none'});
            }
        }
    }); */
});