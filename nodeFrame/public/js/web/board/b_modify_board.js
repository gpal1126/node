$(function(){

    let bcId = getUrlParameter('bcId');   //board 카테고리 id
    console.log('bcId:::'+bcId);
    let json = { 'bcId': bcId };
    let data = json;
    let url = '/admin/d_board_cat/selectBoardByBCId';
    let boardCatInfo = ajax.readData(url, data);
    console.log(boardCatInfo)
    let bcName = boardCatInfo.bcName;
    $('.title').html(bcName);

    let hideContsType = parseInt(boardCatInfo.hideContsType);
    if( hideContsType === 1 ){
        $('.hidden-box').css({'display': 'block'});
    }else {
        $('.hidden-box').css({'display': 'none'});
    }

    let bId = getCookie('bId'); //board id
    console.log('bId:::'+bId);
    json = { 'bId': bId };
    data = json;
    url = '/d_board/detailBoard';
    let boardInfo = ajax.readData(url, data);
    console.log(boardInfo);
    let title = boardInfo.title;
    let contents = boardInfo.contents;
    let hiddenStatus = boardInfo.hiddenStatus;

    // file arr cookie 선언
    let fileItems = new cookieList("fileItems");
    let fileDBItems = new cookieList("fileDBItems");
    //fileDBItems.clear();
    //fileItems.clear();

    //기존 파일 정보 cookie에 담기
    url = '/d_b_file/selectFileByBoardId';
    json = { 'bId': bId };
    data = json;
    let fileInfo = ajax.readData(url, data);
    console.log(fileInfo);
    for(let i=0; i<fileInfo.length; i++){
        let fId = fileInfo[i].fId;
        let fileDir = fileInfo[i].fileDir;
        let fileName = fileInfo[i].fileName;
        let size = parseInt(fileInfo[i].size);
        let extension = fileInfo[i].extension;
        let fileJson = { 'fId':fId, 'fileDir':fileDir, 'fileName':fileName, 'size':size, 'extension':extension };
        console.log(fileJson);
        fileItems.add(fileJson);
        fileDBItems.add(fileJson);
    }
    console.log(fileItems.items())

    $('.board-form #title').val(title); //제목
    
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
    
    //내용
    $('#summernote').summernote('code', contents);

    //비밀글 여부
    if( hiddenStatus === 1 ){
        $('#hiddenStatus').prop('checked', true);
    }else {
        $('#hiddenStatus').prop('checked', false);
    }

    /* 게시물 수정 */
    $('#modify').on('click', function(){

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
        console.log(fileObj)
        let fileArr = new Array();  //file Name
        for(let i=0; i<fileObj.length; i++){
            let fileName = fileObj[i].fileName;
            fileArr.push(fileName);
        }
        //console.log('fileArr:::');
        //console.log(fileArr);

        /* 현재 에디터에 포함된 파일들 */
        let pattern = /<img\s+[^>]*?src=("|')([^"']+)/g;
        let nowFileNameArr = new Array();
        while(pattern.exec(contents)) {
            let rst = RegExp.$2;
            let nowFile = decodeURI(decodeURIComponent(rst.substr(rst.lastIndexOf('/')+1)));
            nowFileNameArr.push(nowFile);
        }
        console.log('nowFileNameArr:::');
        console.log(nowFileNameArr);

        /* 삭제할 파일 */
        let removeFileName = fileArr.diff(nowFileNameArr);
        //console.log(removeFileName);

        /* 삭제할 파일을 fileObj에서 찾아서 파일패스(파일경로+파일명)를 return */
        let removeFilePath = fileObj.filter(function(val) {
            return removeFileName.indexOf(val.fileName) !== -1;
        }).map(function(val, index, arr){
            return val.fileDir + val.fileName;
        });

        let removeFileId = fileObj.filter(function(val) {
            return removeFileName.indexOf(val.fileName) !== -1;
        }).map(function(val, index, arr){
            return val.fId;
        });
 
        console.log('removeFilePath:::');
        console.log(removeFilePath);

        //삭제할 파일이 있으면 삭제
        if( removeFilePath.length !== 0 ){
            for(let i=0; i<removeFilePath.length; i++){
                deleteFile(removeFilePath[i]);
                if( removeFileId[i] !== undefined ){    //파일 데이터가 있을 때만 삭제
                    deleteFileData(removeFileId[i]);
                }
            }
        }

        /* db에 추가할 file 정보 */
        let fileDBArr = fileDBItems.items();
        
        /* 현재 컨텐츠에 있는 file arr */
        console.log(fileObj)
        let nowFileArr = fileObj.filter(function(val) {
            console.log(val)
            return nowFileNameArr.indexOf(val.fileName) !== -1;
        });
        console.log(nowFileArr);

        /* 추가될 파일(현재 컨텐츠에 있는 arr와 db 파일 비교) */
        let insertFileObj = nowFileArr.filter(function(val) {
            return fileDBArr.indexOf(val) === -1;
        })/* .map(function(item){
            item.fileName = decodeURI(decodeURIComponent(item.fileName));
            let domain = item.filePath.split('/images')[0];
            let realFilePath = item.filePath.split(domain)[1];
            item.fileDir = realFilePath;
        }); */
        console.log(insertFileObj);
        if( insertFileObj.length !== 0 ){
            let fileDir = insertFileObj[0].fileDir;
            console.log('fileDir:::'+fileDir);
            
            //json -> String 변경해서 서버로 넘김
            insertFileObj = JSON.stringify(insertFileObj);
                
            console.log('insertFileObj:::');
            console.log(insertFileObj);
            let json = { 'bcId': bcId, 'bId':bId, 'insertFileObj':insertFileObj, 'fileDir':fileDir };
            let url = '/d_b_file/insertFile';
            let data = json;
            let insertFileRst = ajax.createJsonData(url, data);
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

        //숨김 여부
        let hiddenStatus = $('#hiddenStatus').is(':checked');
        if( hiddenStatus ){
            hiddenStatus = 1;
        }else {
            hiddenStatus = 0;
        }

        json = { 'bId':bId, 'title':title, 'contents':contents, 'hiddenStatus':hiddenStatus };
        console.log( json );
        url = '/d_board/modifyBoard';
        data = json;
        let boardInfo = ajax.updateData(url, data);
        console.log(boardInfo);
        if( boardInfo === 1 ){
            location.href = '/board/list?bcId='+bcId;
        }
    });

    /* 게시글 취소 버튼 클릭 */
    $('.board-form #cancel').on('click', function(){
        location.href = '/board/list?bcId='+bcId;
    });

    /* 파일 업로드 func */
    function sendFile(file, editor, welEditable) {
        
        const fd = new FormData();
        boardObj = { 'bcId': bcId, 'bId': bId };
        boardObj = JSON.stringify(boardObj);
        fd.append('folderId', boardObj);  //업로드할 파일 폴더명에 사용
        fd.append('fileDirType', 'board');  //업로드할 파일 경로
        fd.append('file', file);

        let url = '/d_b_file/uploadFile';
        //let type = 'POST';
        let data = fd;
        
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
    function deleteFile(filePath) {
        console.log(filePath);
        let url = '/d_b_file/deleteFile';
        let json = { 'filePath': filePath };
        console.log(json);
        let data = json;
        
        deleteFileRst = ajax.deleteData(url, data);
        console.log(deleteFileRst);
    }

    /* 파일 데이터 삭제 func */
    function deleteFileData(fId) {
        console.log(fId);
        let url = '/d_b_file/deleteFileData';
        let json = { 'fId': fId };
        console.log(json);
        let data = json;
        
        deleteFileDataRst = ajax.deleteData(url, data);
        console.log(deleteFileDataRst);
    }

    /* 그래도 나가시겠습니까 경고창 */
    let warning = true;
    window.onbeforeunload = function() { 
    //$(window).on('beforeunload', function() { 
        console.log('warning:::'+warning);
        if( warning ){
            return 'out';
        }else {
            return false;
        }
    };

    /* 페이지 벗어날 경우 */
    $(window).on('unload', function() { 
        if( warning ){
            let fileDBArr = fileDBItems.items();
            let fileDBNameArr = new Array();  //file Name
            for(let i=0; i<fileDBArr.length; i++){
                let fileName = fileDBArr[i].fileName;
                fileDBNameArr.push(fileName);
            }
            
            let fileArr = fileItems.items();
            let fileNameArr = new Array();  //file Name
            for(let i=0; i<fileArr.length; i++){
                let fileName = fileArr[i].fileName;
                fileNameArr.push(fileName);
            }

            /* 삭제할 파일 */
            let removeFileName = fileNameArr.diff(fileDBNameArr);
            
            /* 삭제할 파일을 fileObj에서 찾아서 파일패스(파일경로+파일명)를 return */
            let removeFilePath = fileArr.filter(function(val) {
                return removeFileName.indexOf(val.fileName) !== -1;
            }).map(function(val, index, arr){
                console.log(val)
                return val.fileDir + val.fileName;
            });
            console.log(removeFilePath);

            // 기존 파일 제외한 업로드한 파일 삭제
            if( removeFilePath.length !== 0 ){
                for(let i=0; i<removeFilePath.length; i++){
                    deleteFile(removeFilePath[i]);
                }
            }

            fileDBItems.clear();
            removeCookie(fileDBItems);
            fileItems.clear();
            removeCookie(fileItems);
            return false;
        }else {

            fileDBItems.clear();
            removeCookie(fileDBItems);
            fileItems.clear();
            removeCookie(fileItems);

            return false;
        }
    });

    /* 두 배열의 차이 값 */
    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) === -1;
        });
    };
});