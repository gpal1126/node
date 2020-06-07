$(function(){
    //쿠키에 저장된 id
    const saveId = getCookie('saveId');
    $('#id').val(saveId);
    console.log(saveId)
    //쿠키에 저장된 이메일 값이 있으면 체크박스 체크
	 if( $('#id').val() !== '' ){
        $('#saveEmail input[type=checkbox]').prop('checked', true);
    }//if

    //로그인 버튼 클릭 
    $('#login').on('click', function(){
        login();
    });

    //로그인시 엔터키 적용
    $('.u-join-type-row').on('keyup', '#id, #password', function(){
        if (window.event.keyCode == 13) {
            // 엔터키가 눌렸을 때 실행할 내용
            login();
       }
    });

    //로그인 
    function login(){
        const id = $('#id').val();
        const password = $('#password').val();

        if( id === '' ){
            alert('아이디를 입력해주세요.');
        }

        if( password === '' ){
            alert('비밀번호를 입력해주세요.');
        }

        if( id !== '' && password !== '' ){

            const url = '/auth/login';
            const type = 'POST';
            const dataType = 'json';
            const json = { 'id': id, 'password': password };
            console.log(json);
            
            const data = ajaxFunc(url, type, json, dataType );
            console.log(data);

            let message;

            if( data === 1 ){    //로그인 성공                
                //이메일 저장 체크박스 체크시 쿠키 저장
                if( $('#saveEmail input[type=checkbox]').is(':checked') ){
                    setCookie('saveId', id, 7);	//7일동안 쿠키 저장
                }else {
                    removeCookie('saveId');
                }//if
                
                //로그인 후 원래 있던 페이지로 이동
                location.href = document.referrer;
            }else {
                if( data === 'no_athnt' ){
                    message = '이메일 인증 후 서비스를 이용하실 수 있습니다.';
                }else if( data === 'mis_pwd' ){
                    message = '비밀번호가 일치하지 않습니다.';
                }else if( data === 'no_user' ){
                    message = '가입되지 않은 회원입니다.';
                }else if(data ==='deleted'){
                    message = '탈퇴한 회원입니다.';
                }
                alert(message)
                $('.login-form .chk-val').html(message);
            }
        } 
    }

    /* 네이버로 로그인 */
    $('#loginNaver').on('click', function(){
        location.href = '/auth/naver/login';
    });

    /* 아이디 찾기 */
    $('#findId').on('click', function(){
        location.href = '/users/findId';
    });

    /* 비밀번호 찾기 */
    $('#findPwd').on('click', function(){
        location.href = '/users/findPwd';
    });
    
});