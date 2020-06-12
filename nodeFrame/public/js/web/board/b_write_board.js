$(function(){
    
    //let bcId = getUrlParameter('bcId');
    let bcId = parseInt(location.href.substring(location.href.lastIndexOf('/')+1));
    console.log('bcId:::'+bcId);

    let url;
    let json;
    let data;

    url = '/admin/d_board_cat/selectBoardByBCId';
    json = { 'bcId':bcId };
    data = json;
    boardCatInfo = ajax.readData(url, data);
    console.log(boardCatInfo)
    let bcName = boardCatInfo.bcName;
    $('.title').html(bcName);

    let saveId = getCookie('saveId');
    $('.name-box #name').html(saveId);

    let hideContsType = parseInt(boardCatInfo.hideContsType);
    if( hideContsType === 1 ){
        $('.hidden-box').css({'display': 'block'});
    }else {
        $('.hidden-box').css({'display': 'none'});
    }

    //sessionStorage에 담겨있는 bId
    url = '/d_board/boards/bcId/'+bcId;
    json = { 'bcId':bcId };
    data = json;
    let bId = ajax.createJsonData(url, data);
    console.log('bId:::'+bId);
    sessionStorage.setItem('bId', bId);

    function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }

    /* 그래도 나가시겠습니까 경고창 */
    let warning = true;
    window.onbeforeunload = function() { 
    //$(window).on('beforeunload', function() { 
    //window.addEventListener('beforeunload', async function (e) {
        if( warning ){
            return 'out';
        }else {
            return false;
        }
    };

    /* 페이지 벗어날 경우 */
    $(window).on('unload', function() { 
        console.log('warning:::'+warning);
        
        if( warning ){
            let fileArr = fileItems.items();
            console.log(fileArr.length);
            // 업로드한 파일 삭제
            if( fileArr.length !== 0 ){
                for(let i=0; i<fileArr.length; i++){
                    let fileDir = fileArr[i].fileDir;
                    let fileName = fileArr[i].fileName;
                    let filePath = fileDir+fileName;
                    console.log('filePath:::'+filePath);
                    let url = '/d_b_file/deleteFile';
                    let json = { 'filePath': filePath };

                    let data = json;
                    $.ajax({
                        url: url,
                        async: false,
                        type: 'DELETE',
                        data: data,
                        //dataType: 'json',
                        /* success: function(data){
                            console.log('파일 삭제');
                            console.log(data);
                        }, */
                    }).done(function(data) {
                        console.log('end');
                    });

                    //await deleteFile(filePath);
                }
            }

            let bId = sessionStorage.getItem('bId');
            let json = { 'bcId':bcId, 'bId':bId };
            console.log( json );
            let url = '/d_board/deleteEmptyBoard';
            let data = json;
            $.ajax({
                url: url,
                async: false,
                type: 'DELETE',
                data: data,
                //dataType: 'json',
                /* success: function(data){
                    console.log('게시판 id 삭제');
                    console.log(data);
                }, */
            }).done(function(data) {
                console.log('end');
            });

            //let deleteRst = await ajax.deleteData(url, data);
            //console.log(deleteRst);
            fileItems.clear();
            removeCookie(fileItems);
            
            //sleep(5000);
        }else {

            fileItems.clear();
            removeCookie(fileItems);

            return false;
        }
    }); 

    // file arr cookie 선언
    let fileItems = new cookieList("fileItems");

    $('#summernote').summernote({
        placeholder: '작성해주세요.',
        //tabsize: 2,
        height: 300,
        callbacks: {
            onImageUpload : function(files, editor, welEditable) {
                console.log(files)
                for(var i = files.length - 1; i >= 0; i--) {
                    sendFile(files[i], editor, welEditable);
                }
            },
            onMediaDelete : function(target, editor, welEditable) {
                //한글 디코딩
                filePath = decodeURI(decodeURIComponent(target[0].src));
                let domain = filePath.split('/images')[0];
                let realFilePath = filePath.split(domain)[1];
                console.log('realFilePath:::'+realFilePath);
                deleteFile(realFilePath);
            },
            onChange: function(contents, $editable){
                
            },
        },
        lang: 'ko-KR'
    });

    /* 게시물 등록 */
    $('#confirm').on('click', function(){

        //경고창 없애기
        warning = false;
        window.onbeforeunload = null;
        //window.onunload = null;
        //$(window).off("beforeunload");
        //$(window).off("unload");

        let title = $('#title').val();
        let contents = $('#summernote').summernote('code');

        /* 전체 파일 Obj (현재 업로드된 파일들) */
        let fileObj = filter_array(fileItems.items());  //file Obj
        let fileArr = new Array();  //file Name
        for(let i=0; i<fileObj.length; i++){
            let fileName = fileObj[i].fileName;
            fileArr.push(fileName);
        } 
        //console.log('fileArr:::');
        //console.log(fileArr);

        /* 현재 에디터에 포함된 파일들 */
        let pattern = /<img\s+[^>]*?src=("|')([^"']+)/g;
        let nowFileArr = new Array();
        while(pattern.exec(contents)) {
            let rst = RegExp.$2;
            let nowFile = decodeURI(decodeURIComponent(rst.substr(rst.lastIndexOf('/')+1)));
            nowFileArr.push(nowFile);
        }
        console.log('nowFileArr:::');
        console.log(nowFileArr);


        /* 두 배열의 차이 값 */
        Array.prototype.diff = function (a) {
            return this.filter(function (i) {
                return a.indexOf(i) === -1;
            });
        };

        /* 삭제할 파일 */
        let removeFileName = fileArr.diff(nowFileArr);
        //console.log(removeFileName);

        /* 삭제할 파일을 fileObj에서 찾아서 파일패스(파일경로+파일명)를 return */
        let removeFilePath = fileObj.filter(function(val) {
            return removeFileName.indexOf(val.fileName) !== -1;
        }).map(function(val, index, arr){
            return val.fileDir + val.fileName;
        });
 
        console.log('removeFilePath:::');
        console.log(removeFilePath);

        //삭제할 파일이 있으면 삭제
        if( removeFilePath.length !== 0 ){
            for(let i=0; i<removeFilePath.length; i++){
                deleteFile(removeFilePath[i]);
            }
        }

        /* 잘라내기 붙여넣기한 img src URI 한글 디코딩 + 도메인 지우기 */
        while(pattern.exec(contents)) {
            let rst = RegExp.$2;
            let nowFile = decodeURI(decodeURIComponent(rst));
            console.log('nowFile:::'+nowFile);
            let domain = nowFile.split('/images')[0];
            console.log(domain);
            let replaceFile;
            if( domain !== '' ){    //잘라내기 붙여넣기 했을 경우 도메인 생성되어 도메인 지우기
                replaceFile = nowFile.split(domain)[1];
            }else { //바로 업로드 한 경우는 그냥 업로드 패스 받기
                replaceFile = nowFile;
            }
            console.log('replaceFile:::'+replaceFile);
            contents = contents.replace(rst, replaceFile);
        }

        bId = sessionStorage.getItem('bId');

        //숨김 여부
        let hiddenStatus = $('#hiddenStatus').is(':checked');
        if( hiddenStatus ){
            hiddenStatus = 1;
        }else {
            hiddenStatus = 0;
        }

        let json = { 'bId':bId, 'title':title, 'contents':contents, 'hiddenStatus':hiddenStatus };
        console.log( json );
        let url = '/d_board/boards';
        let data = json;
        let boardInfo = ajax.createJsonData(url, data);
        console.log(boardInfo);

        /* db에 추가할 file 정보 */
        let insertFileObj = fileObj.filter(function(val) {
            return nowFileArr.indexOf(val.fileName) !== -1;
        })/* .map(function(item){
            item.fileName = decodeURI(decodeURIComponent(item.fileName));
            let domain = item.filePath.split('/images')[0];
            let realFilePath = item.filePath.split(domain)[1];
            item.fileDir = realFilePath;
        }); */
        console.log(insertFileObj)


        let fileDir;
        if( insertFileObj.length !== 0 ){
            fileDir = insertFileObj[0].fileDir;
        }
        console.log('fileDir:::'+fileDir);
        
        //json -> String 변경해서 서버로 넘김
        insertFileObj = JSON.stringify(insertFileObj);

        if( boardInfo.length !== 0 ){
            
            console.log('insertFileObj:::');
            console.log(insertFileObj);
            json = { 'bcId': bcId, 'bId':bId, 'insertFileObj':insertFileObj, 'fileDir':fileDir };
            url = '/d_b_file/insertFile';
            data = json;
            insertFileRst = ajax.createJsonData(url, data);
            if( insertFileRst === 1 ){
                location.href = '/board/list/'+bcId;
            }
        }
        
    });

    /* 게시글 취소 버튼 클릭 */
    $('.board-form #cancel').on('click', function(){
        location.href = '/board/list/'+bcId;
    });

    /* 파일 업로드 func */
    function sendFile(file, editor, welEditable) {

        let bId = sessionStorage.getItem('bId');
        
        const fd = new FormData();
        console.log('sendFile:::bcId:::'+bcId);
        boardObj = { 'bcId': bcId, 'bId': bId };
        boardObj = JSON.stringify(boardObj);
        fd.append('folderId', boardObj);  //업로드할 파일 폴더명에 사용
        fd.append('fileDirType', 'board');  //업로드할 파일 경로
        fd.append('file', file);

        url = '/d_b_file/uploadFile';
        data = fd;
        
        let fileRst = ajax.createFormData(url, data);
        console.log(fileRst);
        let fileDir = fileRst.fileDir;
        let fileName = fileRst.fileName;
        let size = fileRst.size;
        let extension = fileRst.extension;

        fileItems.add(fileRst);
        console.log(fileItems.items())

        let imgUrl = fileDir+fileName;
        $('#summernote').summernote('editor.insertImage', imgUrl);
    }

    /* 파일 삭제 func */
    async function deleteFile(filePath) {
        console.log(filePath);
        let url = '/d_b_file/deleteFile';
        let json = { 'filePath': filePath };
        console.log(json);
        //let type = 'POST';
        let data = json;
        
        deleteFileRst = await ajax.deleteData(url, data);
        console.log(deleteFileRst);
    }
});