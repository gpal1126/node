$(function(){

    //스텝에 따라 입력 폼 다르게 보이기
    //stepMenuFunc();

    /*** 이용약관 페이지 ***/
    /* 동의 텍스트 toggle */
    $('.agree-box').on('click', 'input[type=checkbox], .agree-txt', function(){
        let checkbox =  $(this).parents('.agree-box').children('input[type=checkbox]');
        $agreeTxt = $(this).parents('.agree-box').children('input[type=checkbox]').next();            // find a label element
        if( checkbox .prop('checked') ){
            checkbox.prop('checked', false);
            $agreeTxt.css('color', '#7f7e7e');      // agreeTxt의 배경색을 바꾼다.
        }else {
            checkbox.prop('checked', true);
            $agreeTxt.css('color', '#00a3f5');      // agreeTxt의 배경색을 바꾼다.
        }
    })

    $('.agree-row').on('click', '.agree-label input[type=checkbox]', function(){
        let checkbox =  $('.agree-label input[type=checkbox]');
        console.log(checkbox)
        if(checkbox[0].checked == true){
            $('.agree-sub-label input[type=checkbox]').prop('checked', true)
        }else{
            $('.agree-sub-label input[type=checkbox]').prop('checked', false)
        }
        
    })

    $('#agreeBtn').on('click', function(){
        const agree1 = $("#agreeBox1 input[type='checkbox']").is(":checked");
        //console.log('agree1:::'+agree1);
        const agree2 = $("#agreeBox2 input[type='checkbox']").is(":checked");
        //console.log('agree2:::'+agree2);

        if( agree1 === false ){
            alert("이용약관을 동의해주세요.");
            return false;
        }
        
        if( agree2 === false ){
            alert("개인정보수집,제공 및 이용을 동의해주세요.");
            return false;
        }

        //모든 약관 동의시 회원 가입 페이지로 이동
        const agreeLen =  $(".joinuser-form .agree-box input[type='checkbox']:checked").length;
        if( agreeLen === 2 ){
            location.href = "/users/joinUser?step=2";
        }
    });
    /*** 이용약관 페이지 ***/

    /*** 회원 가입 페이지 ***/
    /* 아이디 입력시 */
    let chkId = false;
    let duplChkId = false;
    $('#id').on('keyup', function(){
        chkId = false;
        duplChkId = false;
        const id = $('#id').val();
        //아이디 정규식 체크
        chkRegId(id);
    });
    
    /* 아이디 정규식 체크 */
    function chkRegId(id){
        if( regId(id) ){
            $('.m-id').children('.chk-val:not(.chk-true)').html('');
            chkId = true;
        }else {
            $('.m-id').children('.chk-val').html('5~10자 영문/숫자만 가능합니다.');
            return false;
        }
        return chkId;
    }
    
    /* 아이디 중복 체크 */
    function duplicateChkId(){
        const id = $('#id').val();
        console.log('id:::'+id);
        if( id !== '' ){
            //아이디 정규식 체크
            chkRegId(id);
            console.log('chkId:::'+chkId);

            if( chkId === true ){
                let json = {'id': id};
                let url = '/d_users/duplChkId';
                //let type = 'GET';
                let data = json;
                console.log(json)
                //let dataType = 'json';
                let duplChkRst = ajax.readData(url, data);
                console.log(duplChkRst);
                
                if( duplChkRst === 1 ){
                    $('.m-id').children('.chk-val').html('사용 가능한 아이디입니다.');
                    $('.m-id').children('.chk-val').addClass('chk-true');
                    $('.m-id').children('.chk-true').css({'color': '#08c'});
                    duplChkId = true;
                }else {
                    $('.m-id').children('.chk-val').removeClass('chk-true');
                    $('.m-id').children('.chk-val').html('이미 사용중인 아이디입니다. 다른 아이디를 이용해주세요.');
                    $('.m-id').children('.chk-val').css({'color': '#F44336'});
                    duplChkId = true; //중복버튼 사라지면서 추가 수정(흥열)
                    return false;
                }
            }
            
        }else {
            $('.m-id').children('.chk-val').removeClass('chk-true');
            $('.m-id').children('.chk-val').html('아이디를 먼저 입력해주세요.');
            $('.m-id').children('.chk-val').css({'color': '#F44336'});
            return false;
        }
    }
    

    //패스워드 체크하기
    //비밀번호 입력 체크
	
	//새 비밀번호1 정규식 체크
    let chkPwd = false;
	$('#password1').on('keyup', function(){
        chkPwd = false;
        var pwd = $(this).val();
        //패스워드 정규식 체크
		chkRegPwd1(pwd);
    });
    
    /* 패스워드 정규식 체크 */
    function chkRegPwd1(pwd){
        if(pwd != ''){ //패스워드 빈값인지 체크
            if( regNewPwd(pwd) ){   //패스워드 정규식 체크
                $('.m-password1').children('.chk-val').html('');
                chkPwd = true;
                
                $('#password1').on('keyup', function(){ //비밀번호 일치하는지 한번 더 체크
                    if( $('#password1').val() === $('#password2').val() ) {	//비밀번호 체크
                        //$('#chkPwd2').remove();
                        $('#password2').parents('.m-password2').children('.chk-val').html('');
                        chkPwd = true;
                    }else {
                        if( $('#password2').val() !== '' ){
                            //$('#chkPwd2').remove();
                            $('#password2').parents('.m-password2').children('.chk-val').html('패스워드가 일치하지 않습니다.');
                            return false;
                            //$("#password2").after('<span class="chk-pwd" id="chkPwd2">패스워드가 일치하지 않습니다.</span>');
                        }
                        return false;
                    }//if
                });
            }else {
                $('.m-password1').children('.chk-val').html('8~16자의 하나 이상의 영문/숫자/특수문자의 조합만 가능합니다.');
                return false;
            }//if
        }
    }
	
    //새 비밀번호2 체크(비밀번호 일치하는지 체크)
	$('#password2').on('keyup', function(){
        chkPwd = false;
        let password1 = $('#password1').val();
        let password2 = $('#password2').val();
        //패스워드 확인 정규식 체크
        chkRegPwd2(password1, password2);
    });

    /* 패스워드 확인 정규식 체크 */
    function chkRegPwd2(password1, password2){
        if(password1 != ''){
            if( password1 === password2 ) {	//비밀번호 체크
                $('.m-password1').children('.chk-val').html('');
                chkPwd = true;
            }else {
                if( password2 !== '' ){
                    $('.m-password1').children('.chk-val').html('패스워드가 일치하지 않습니다.');
                    chkPwd = false;
                }
            }//if
        }
    }
    
    /* 이름 입력시 */
    let chkName = false;
    $('#name').on('keyup', function(){
        chkName = false;
        const name = $('#name').val();
        //이름 정규식 체크
        chkRegName(name);
    });

    /* 이름 정규식 체크 */
    function chkRegName(name){
        if( regName(name) ){
            $('.m-name').children('.chk-val').html('');
            chkName = true;
        }else {
            $('.m-name').children('.chk-val').html('한글만 사용 가능합니다.');
            return false;
        }
    }

    /* 영문이름 입력시 */
    let chkNameEng = false;
    $('#nameEng').on('keyup', function(){
        chkNameEng = false;
        const nameEng = $(this).val();
        //영문이름 정규식 체크
        chkRegNameEng(nameEng);
    });

    /* 영문이름 정규식 체크 */
    function chkRegNameEng(nameEng){
        if( regNameEng(nameEng) ){
            $('.m-nameEng').children('.chk-val').html('');
            chkNameEng = true;
        }else {
            $('.m-nameEng').children('.chk-val').html('영문만 사용 가능합니다.');
            return false;
        }
    }

    /* 영문이름 자동 변환 */
    $('#convertAuto').on('click', function(){
        const name = $('#name').val();
        console.log('name:::'+name);
        if( name !== '' ){
            let json = {'name': name};
            let url = '/d_users/convertAutoEngNm';
            //let type = 'GET';
            let data = json;
            //let dataType = 'json';
            let nameEngRst = ajax.readData(url, data);
            console.log(nameEngRst);
            if( nameEngRst !== 0 ){
                $('#nameEng').val(nameEngRst);
                $('.m-nameEng').children('.chk-val').html('');
            }else {
                $('.m-nameEng').children('.chk-val').html('해당 성명은 영문이름 자동변환이 어렵습니다. 직접 입력 부탁드립니다.');
                return false;
            }
        }else {
            $('.m-name').children('.chk-val').html('성명을 먼저 입력해주세요.');
            return false;
        }
    });
    /* 영문이름 자동 변환 */

    /* 휴대폰번호 입력시 */
    let chkPhoneNo = false;
    $('#phoneNo1, #phoneNo2, #phoneNo3').on('keyup', function(e){
        chkPhoneNo = false;
        const phoneNo1 = $('#phoneNo1').val();
        const phoneNo2 = $('#phoneNo2').val();
        const phoneNo3 = $('#phoneNo3').val();
        //휴대폰번호 정규식 체크
        chkRegPhoneNo(phoneNo1, phoneNo2, phoneNo3);
    });

    /* 휴대폰번호 정규식 체크 */
    function chkRegPhoneNo(phoneNo1, phoneNo2, phoneNo3){
        if( regPhoneNo(phoneNo1) && regPhoneNo(phoneNo2) && regPhoneNo(phoneNo3) ){
            $('.m-phoneNo').children('.chk-val:not(.chk-true)').html('');
            chkPhoneNo = true;
        }else {
            $('.m-phoneNo').children('.chk-val').html('숫자만 사용 가능합니다.');
            return false;
        }
    }
    
    /* 휴대폰 인증요청 팝업 */
    $('.req-athnt-no').on('click', function(e){
        let phoneNo1 = $('#phoneNo1').val();
        let phoneNo2 = $('#phoneNo2').val();
        let phoneNo3 = $('#phoneNo3').val();

        console.log(phoneNo2 == '')
        if( phoneNo1 !== '' && phoneNo2 !== '' && phoneNo3 !== '' ){
            $('.m-phoneNo').children('.chk-val:not(.chk-true)').html('');
            let phoneNo = phoneNo1 + phoneNo2 + phoneNo3;
            let json = {'phoneNo': phoneNo};
            console.log(json);

            let url = '/d_users/reqAthntNo';
            //let type = 'GET';
            let data = json;
            //let dataType = 'json';
            let reqAthntRst = ajax.readData(url, data);
            console.log(reqAthntRst);
            if( reqAthntRst === 1 ){

                timerFunc(); //시간 타이머
                //인증번호 입력 박스 보이게
                if ( $('.athnt-no-pop').is( ":hidden" ) ) {
                    $('.athnt-no-pop').slideDown( "slow" );
                }

                $(this).prop('disabled', true); //요청시간 동안 인증요청 버튼 클릭 방지

            }else {
                $('.m-phoneNo').children('.chk-val').removeClass('chk-true');
                $('.m-phoneNo').children('.chk-val').html('휴대폰 인증 요청을 실패하였습니다. 관리자에게 문의해주시기 바랍니다.');
                $('.m-phoneNo').children('.chk-val').css({'color': '#F44336'});
            }
           
        }else {
            $('.m-phoneNo').children('.chk-val').html('휴대폰번호를 먼저 입력해주세요.');
        }
    });

    //인증 확인
    let athntSuccess = false;

    /* 인증번호 확인 */
    $('.confirm-athnt-no').on('click', function(){
        let phoneNo = $('#phoneNo1').val() + $('#phoneNo2').val() + $('#phoneNo3').val();
        let athntNo = $('#athntNo').val();
        let json = {'phoneNo':phoneNo, 'inputAthntNo': athntNo};
        console.log(json);
        let url = '/d_users/confirmAthntNo';
        //let type = 'GET';
        let data = json;
        //let dataType = 'json';
        let athntChkRst = ajax.readData(url, data);
        console.log('인증번호 확인 결과:::'+athntChkRst);
        if( athntChkRst === 1 ){    //인증 성공
            clearInterval(timer);
            //인증요청 버튼 disabled
            $('.req-athnt-no').off('click');
            $('.req-athnt-no').css({'background-color':'rgba(34, 36, 38, 0.15)', 'cursor':'initial'});
            //인증번호 입력 박스 숨기기
            $('.athnt-no-pop').slideUp('slow');
            $('.m-phoneNo').children('.chk-val').html('휴대폰 인증을 성공하였습니다.');
            $('.m-phoneNo').children('.chk-val').addClass('chk-true');
            $('.m-phoneNo').children('.chk-true').css({'color': '#08c'});
            athntSuccess = true;    //인증 성공
        }else {
            $('.m-phoneNo').children('.chk-val').removeClass('chk-true');
            $('.m-phoneNo').children('.chk-val').html('휴대폰 인증을 실패하였습니다. 다시 입력해주세요.');
            $('.m-phoneNo').children('.chk-val').css({'color': '#F44336'});
        }
    });

    /***** 시간 타이머 *****/
	var timer;
	function timerFunc(){
		
		//var hour = 0;
		var minute = '0'+3; 
		var second = '0'+0;
		
		//$('.countTimeHour').html(hour);
		$('.cntMinute').html(minute);
		$('.cntSecond').html(second);
		timer = setInterval(function(){
			//$('countTimeHour').html(hour);
			$('.cntMinute').html(minute);
			$('.cntSecond').html(second);
			
			if( second == 0 && minute == 0 /*&& hour == 0*/ ){
                //인증번호 입력 박스 숨기기
                $('.athnt-no-pop').slideUp('slow');
                $('.m-phoneNo').children('.chk-val').html('시간이 초과되었습니다. 다시 한번 인증요청을 해주세요.');

                clearInterval(timer);   //타이머 초기화
                
				$('.req-athnt-no').prop('disabled', false); //인증요청 버튼 클릭 가능하게
				return false;
			}else {
				
				//초 감소
				second--;
				
				//분 카운트 
				if( second < 0){
					minute--;
					second = 59;
				}else if( second < 10 ){ //초를 두자리로 만들기 위해(초가 10보다 작으면 앞에 0을 붙임)
					second = '0'+second--;
				}//if 
				
				//분을 두자리로 만들기 위해
				if( minute < 10) {	//분이 10보다 작으면 앞에 0을 붙임 
					minute = '0'+minute--;
				}//if
				
				/*
				//시간 카운트
				if(minute < 0){
					if(hour>0){
						hour--;
						minute=59;
					}//if
				}//if 
				*/
			}//if
		}, 1000);
	}
	/***** 시간 타이머 *****/
	
    /* 생년월일 */
    //selectboxYear();
    //selectboxMonth();
    //selectboxDay();
    function selectboxYear(){
        const date = new Date();
        const year = date.getFullYear();
        const selectVal = document.getElementById("year");
    
        for(let i=year; i>=year-100; i--){
            selectVal.appendChild(new Option(i+"년", i));
        }
    }
    
    function selectboxMonth(){
        const selectVal = document.getElementById("month"); 
    
        for(let i=1;i<=12;i++){
            selectVal.appendChild(new Option(i+"월", i));
        }
    }
    
    function selectboxDay(){
        const selectVal = document.getElementById("day");
        //let optIdx = 0;
    
        for(let i=1;i<=31;i++){
            selectVal.appendChild(new Option(i+"일", i));
        }
    } 
    /* 생년월일 */
    
    /* 이메일 입력시 */
    let chkEmail = false;   //정규식체크 변수
    let duplChkEmail = false;   //중복체크 변수
    $('#email').on('keyup', function(){
        chkEmail = false;
        duplChkEmail = false;
        const email1 = $('#email1').val();
        const email2 = $('#email2').val();
        const email = email1+'@'+email2;    

        //이메일 정규식 체크
        chkRegEmail(email);
    });

    //이메일 주소 selectbox 변경하기
    $("#selectEmail").on('change', function(){
        const email1 = $('#email1').val();
        //const email2 = $('#email2').val();
        const selectedEmail = $(this).val();
        const email = email1+'@'+selectedEmail;   
        //console.log("selectedEmail:::"+selectedEmail);
        if( selectedEmail === '0' ){    //직접입력
            $("#email2").prop('disabled', false);
            $("#email2").val('');
            $('#email2').focus();
        }else { //해당 이메일 주소로 변경
            $("#email2").val(selectedEmail);
            $("#email2").prop('disabled', true);
        }
        //이메일 정규식 체크
        chkRegEmail(email);
    });

    /* 이메일 정규식 체크 */
    function chkRegEmail(email){
        if( regEmail(email) ){
            $('.m-email').children('.chk-val:not(.chk-true)').html('');
            chkEmail = true;
        }else {
            $('.m-email').children('.chk-val').html('이메일 형식이 올바르지 않습니다.');
            return false;
        }
    }

    function duplicateChkEmail(){ //이메일 체크 버튼이 사라지면서 만들어진 function
        const email1 = $('#email1').val();
        console.log('email1:::'+email1);
        const email2 = $('#email2').val();
        console.log('email2:::'+email2);

        if( email1 !== "" && email2 !== "" ){
            const email = email1+'@'+email2;    
            console.log(email);

            //이메일 정규식 체크
            chkRegEmail(email);

            if( chkEmail === true ){    //이메일 정규식 체크
                const json = { 'email': email };
                let url = '/d_users/selectUserInfoByEmail';
                //let type = 'GET';
                let data = json;
                console.log(json)
                //let dataType = 'json';
                let duplChkRst = ajax.readData(url, data);
                console.log(duplChkRst);
                if( duplChkRst === 1 ){
                    $('.m-email').children('.chk-val').html('사용 가능한 이메일입니다.');
                    $('.m-email').children('.chk-val').addClass('chk-true');
                    $('.m-email').children('.chk-true').css({'color': '#08c'});
                    duplChkEmail = true;
                }else {
                    $('.m-email').children('.chk-val').removeClass('chk-true');
                    $('.m-email').children('.chk-val').html('이미 사용중인 이메일입니다. 다른 이메일을 이용해주세요.');
                    $('.m-email').children('.chk-val').css({'color': '#F44336'});
                    return false;
                }
            }

        }else {
            $('.m-email').children('.chk-val').html('이메일 먼저 입력해주세요.');
            $('.m-email').children('.chk-val').css({'color': '#F44336'});
            return false;
        }
    }

    //이메일 중복 체크
    $('#duplChkEmail').on('click', function(){
        const email1 = $('#email1').val();
        console.log('email1:::'+email1);
        const email2 = $('#email2').val();
        console.log('email2:::'+email2);

        if( email1 !== "" && email2 !== "" ){
            const email = email1+'@'+email2;    
            console.log(email);

            //이메일 정규식 체크
            chkRegEmail(email);

            if( chkEmail === true ){    //이메일 정규식 체크
                const json = { 'email': email };
                let url = '/d_users/selectUserInfoByEmail';
                //let type = 'GET';
                let data = json;
                console.log(json)
                //let dataType = 'json';
                let duplChkRst = ajax.readData(url, data);
                console.log(duplChkRst);
                if( duplChkRst === 1 ){
                    $('.m-email').children('.chk-val').html('사용 가능한 이메일입니다.');
                    $('.m-email').children('.chk-val').addClass('chk-true');
                    $('.m-email').children('.chk-true').css({'color': '#08c'});
                    duplChkEmail = true;
                }else {
                    $('.m-email').children('.chk-val').removeClass('chk-true');
                    $('.m-email').children('.chk-val').html('이미 사용중인 이메일입니다. 다른 이메일을 이용해주세요.');
                    $('.m-email').children('.chk-val').css({'color': '#F44336'});
                    return false;
                }
            }

        }else {
            $('.m-email').children('.chk-val').html('이메일 먼저 입력해주세요.');
            $('.m-email').children('.chk-val').css({'color': '#F44336'});
            return false;
        }
    });

    /* 주소 api */
    //$('.search-addr').postcodifyPopUp();
    $('.search-addr').on('click', function(){
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                const roadAddr = data.roadAddress; // 도로명 주소 변수

                //우편번호, 도로명주소, 예상 지번 주소 출력
                document.getElementById('zipno').value = data.zonecode; //우편번호
                document.getElementById("addr").value = roadAddr;   //도로명주소
                document.getElementById('addrEngHidden').value = data.roadAddressEnglish;   //영문 도로명주소
                const guideTextBox = document.getElementById("guide");   
                //guideTextBox.innerHTML = '(영문 도로명주소 : ' + data.roadAddressEnglish + ')';    //영문 도로명주소
                //guideTextBox.style.display = 'block';
                //document.getElementById("numberAddr").value = data.jibunAddress;
                
                // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                if(data.autoRoadAddress) {  //지번 주소에 매핑된 도로명 주소가 여러개일 경우, 사용자가 지번주소 선택시 도로명 주소 자동 매핑
                    const expRoadAddr = data.autoRoadAddress;
                    console.log('도로명주소 자동 매칭:::'+expRoadAddr);
                    document.getElementById("addr").value = expRoadAddr;
                    //var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    //guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    //guideTextBox.style.display = 'block';
                    
                }
                
                if(data.autoRoadAddressEnglish) {  //도로명주소에 매핑된 지번주소가 여러개일 경우, 도로명주소 선택시 지번주소 자동 매핑
                    const expRoadAddressEnglish = data.autoRoadAddressEnglish;
                    console.log('지번주소 자동 매칭:::'+expRoadAddressEnglish);
                    document.getElementById('addrEngHidden').value = expRoadAddressEnglish;   //영문 도로명주소
                    //document.getElementById("numberAddr").value = expJibunAddr;
                    //guideTextBox.innerHTML = '(예상 지번 주소 : ' + expRoadAddressEnglish + ')';
                    //guideTextBox.style.display = 'block';
                }
            }
        }).open();
    })
    /* 주소 api */

    /* 영문주소 변환 */
    $('.convert-addr').on('click', function(){
        const zipno = $('#zipno').val();    //우편번호
        const addr = $('#addr').val();    //영문도로명주소 hidden
        const detailAddr = $('#detailAddr').val();
        const addrEngHidden = $('#addrEngHidden').val();    //영문도로명주소 hidden
        
        if( zipno !== '' && addr !== '' && detailAddr !== '' ){
            const detailAddrEng = romazaFunc(detailAddr);
            console.log('detailAddrEng:::'+detailAddrEng);
            $('#zipnoEng').val(zipno);  //우편주소 넣기
            $('#addrEng').val(addrEngHidden);   //영문 도로명주소 넣기
            $('#detailAddrEng').val(detailAddrEng);
        }else {
            $('.m-addr').children('.chk-val').html('주소를 먼저 입력해주세요.');
        }
    });

    /* 개인통관고유번호 입력시 */
    let chkPccc = false;   //정규식체크 변수
    $('#pccc').on('keyup', function(){
        chkPccc = false;
        const pccc = $('#pccc').val();

        //개인통관고유번호 정규식 체크
        chkRegPccc(pccc);
    });

     /* 개인통관고유번호 체크 */
     function chkRegPccc(pccc){
        if( regPccc(pccc) ){
            $('.m-pccc').children('.chk-val:not(.chk-true)').html('');
            chkPccc = true;
        }else {
            $('.m-pccc').children('.chk-val').html('개인통관고유번호 형식이 올바르지 않습니다.');
            return false;
        }
    }

    /* 개인통관고유번호 발급/조회 사이트 이동  */
    $('.pccc-btn').on('click', function(){
        window.open('https://unipass.customs.go.kr/csp/persIndex.do', '_blank').focus();
    });

    /* 필수항목 체크 func */
    function nullValChkFunc(){
        const form = '.joinuser-form';
        //필수항목 체크 초기화
        $('.chk-val:not(.chk-true)').html('');

        //필수항목 체크 배열
        let nullValChkArr = new Array();

        //input 필수항목 체크한 후 배열에 push
        $(form+' input').each(function(){
            if( ($(this).attr('required') && $(this).val() === '') ){ //필수항목이 null 값이면
                nullValChkArr.push($(this).attr('id'));
                console.log($(this))
            }
        });

        //select 필수항목 체크한 후 배열에 push
        $(form+' select').each(function(){
            if( $(this).attr('required') && $(this).children('option:selected').val() === '0' ){ //필수항목이 null 값이면
                nullValChkArr.push($(this).attr('id'));
            }
        });

        //필수항목 체크해주기
        $.each(nullValChkArr, function(idx){
            let nullValChkId = nullValChkArr[idx];
            console.log('nullValChkId:::'+nullValChkId);
            if( $('#'+nullValChkId).val() === '' || $('#'+nullValChkId).children('option:selected').val() === '0' ){
                if( idx === 0 ){
                    $('#'+nullValChkId).focus();
                }
                
                //휴대폰번호
                if( nullValChkId === 'phoneNo2' || nullValChkId === 'phoneNo3' ){
                    nullValChkId = 'phoneNo';
                }
                
                //이메일
                if( nullValChkId === 'email1' || nullValChkId === 'email2' ){
                    nullValChkId = 'email';
                }

                //주소
                if( nullValChkId === 'zipno' || nullValChkId === 'addr' || nullValChkId === 'detailAddr' ){
                    nullValChkId = 'addr';
                }

                //영문주소
                if( nullValChkId === 'zipnoEng' || nullValChkId === 'addrEng' || nullValChkId === 'detailAddrEng' ){
                    nullValChkId = 'addrEng';
                }

                const nullValChkName = $('.m-'+nullValChkId+' .m-subj').html();
                console.log('nullValChkName:::'+nullValChkName)
                $('.m-'+nullValChkId+' .chk-val').html(nullValChkName+'은(는) 필수 항목입니다.');
            }
        });

        return nullValChkArr;
    }

    //회원가입 버튼 클릭
    $("#joinUserBtn").on("click", function(){
        let id = $("#id").val();
        let password1 = $("#password1").val();
        let password2 = $("#password2").val();
        //let name = $("#name").val();
        //let nameEng = $("#nameEng").val();
        let phoneNo1 = $("#phoneNo1").val();
        let phoneNo2 = $("#phoneNo2").val();
        let phoneNo3 = $("#phoneNo3").val();
        let phoneNo = phoneNo1 +'-'+ phoneNo2 +'-'+ phoneNo3;
        //let year = $("#year").val();
        //let month = $("#month").val();
        //let day = $("#day").val();
        //let birthday = year +'_'+ month +'_'+ day;
        let email1 = $("#email1").val();
        let email2 = $("#email2").val();
        const email = email1+'@'+email2;   
        //const zipno = $('#zipno').val();
        //const addr = $('#addr').val();
        //const detailAddr = $('#detailAddr').val();
        //const addrEng = $('#addrEng').val();
        //const detailAddrEng = $('#detailAddrEng').val();
        //const pccc = $('#pccc').val();
        //const joinPath = $('#joinPath').val();
        console.log('email:::'+email);

        //필수항목 체크 
        let nullValChkArr = nullValChkFunc();
        console.log(nullValChkArr);

        console.log('duplChkId:::'+duplChkId);
        
        //필수 항목 array가 0 이면 insert
        if( nullValChkArr.length === 0 ){

            //아이디 정규식 체크
            chkRegId(id);
            //패스워드 정규식 체크
            chkRegPwd1(password1);
    
            //패스워드 확인 정규식 체크
            chkRegPwd2(password1, password2);
    
            //이름 정규식 체크
            //chkRegName(name);
    
            //영문이름 정규식 체크
            //chkRegNameEng(nameEng);
    
            //휴대폰번호 정규식 체크
            chkRegPhoneNo(phoneNo1, phoneNo2, phoneNo3);
    
            //이메일 정규식 체크
            chkRegEmail(email);

            //개인통관고유번호 정규식 체크
            //chkRegPccc(pccc);
        
            duplicateChkId() //아이디 중복 확인
            duplicateChkEmail() //이메일 중복 확인

            if( duplChkId === false ){
                alert('아이디를 확인해주세요.');
                return false;
            }
            
            console.log('chkPwd : '+chkPwd)
            if(chkPwd == false){
                alert('비밀번호를 확인해주세요.');
                return false;
            }
            if( duplChkEmail === false ){
                alert('이메일을 확인해주세요.');
                return false;
            }

            if( athntSuccess === false ){
                alert('휴대폰 인증을 해주세요.');
                return false;
            }
                    
            if($('#requireAgree').is(":checked") === false){
                alert('필수 약관 동의해주세요.')
                return false;
            }


            //if( chkId === true && duplChkId === true && chkPwd === true && chkName === true && chkNameEng == true && chkPhoneNo === true && athntSuccess === true && chkEmail === true && duplChkEmail === true && chkPccc === true ){
            if( chkId === true && duplChkId === true && chkPwd === true && chkPhoneNo === true && athntSuccess === true && chkEmail === true && duplChkEmail === true ){
                //let json = { "id":id, "password":password1, "name":name, "nameEng":nameEng, "phoneNo":phoneNo, "birthday":birthday, "email": email, "zipno":zipno, "addr":addr, "detailAddr":detailAddr, "addrEng":addrEng, "detailAddrEng":detailAddrEng, "pccc":pccc, "joinPath":joinPath };
                let json = { "id":id, "password":password1, "phoneNo":phoneNo, "email": email };
                console.log(json);
    
                let data = ajax.createJsonData('/d_users/insertUser', json);
    
                console.log(typeof data);
                
                if( data === 1 ){ //회원가입 완료 후 처리해야할 부분
                    location.href = "/users/joinUser?step=3";
                }else {
                    alert('회원 가입이 실패하였습니다. \n문의해주시기 바랍니다.');
                }
            } 
        }
    });

    /* 회원가입 완료 버튼 클릭 */
    $('.joinuser-form #step3').on('click', '#joinConfrim', function(){
        location.href = '/';
    });

    //아이디 정규식 
	function regId(id){
		var regex = /^[0-9a-z]{5,10}$/;
		return regex.test(id);
    }

	//비밀번호 정규식 
	function regNewPwd(pwd){
        //var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,15}$/;
        // /^(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z$&+,:;=?@#|'<>.^*()%!-]{8,16}$/
		//var regex = /^(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z$&+,:;=?@#|'<>.^*()%!-]{8,16}$/;    //기본:영소문자,숫자 추가: 특수문자,대문자
        var regex =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;  //기본: 특수문자, 영문자, 숫자  //참고 https://codeday.me/ko/qa/20190410/201354.html
		return regex.test(pwd);
    }

    //이름 정규식 
	function regName(name){
		var regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
		return regex.test(name);
    }

    //영문이름 정규식 
	function regNameEng(nameEng){
		var regex = /^[a-zA-Z]+$/;
		return regex.test(nameEng);
    }

    //휴대폰번호 정규식
	function regPhoneNo(phoneNo){
		var regex = /^[0-9]+$/;
		return regex.test(phoneNo);
    }
    
    //이메일 정규식
	function regEmail(email){
        //var regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
		var regex = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
		return regex.test(email);
    }
    
    //개인통관고유번호 정규식
    function regPccc(pccc){
        var regex = /^(p|P)[0-9]{12}|[0-9]{13}$/;
        return regex.test(pccc);
    }


    /* 스텝에 따라 입력 폼 다르게 보이기 */
    function stepMenuFunc(){
        /* var url = new URL(location.href);
        var query_string = url.search;
        console.log(query_string)

        var search_params = new URLSearchParams(query_string);  */
        

        const stepId = getUrlParameter('step');
        //모든 step 숨김으로 초기화
        $('.joinuser-form > .step').each(function(idx){
            let stepIdx = idx+1;

            $('#step'+stepIdx).css({'display': 'none'});
            $('.u-step-menu .steps #stepMenu'+stepIdx).removeClass('active');
            $('.u-step-menu .steps #stepMenu'+stepIdx).addClass('disabled');
        })

        //해당 step만 보이게
        $('#step'+stepId).css({'display':'block'});
        $('.u-step-menu .steps #stepMenu'+stepId).removeClass('disabled');
        $('.u-step-menu .steps #stepMenu'+stepId).addClass('active');
    }
});