/*** Controller : 로직 처리 ***/
'use strict'; //엄격모드

const fs = require('fs');
const mkdirp = require('mkdirp');

const fileService = require('../services/s_b_file');

/* 파일 업로드 */
const uploadFile = async function(req, res){
    try {

        console.log('req.body:::')
        //console.log(req)
        console.log(req.body)
        console.log(req.file)
        
        /* req.body.fileDir = req.file.destination;
        req.body.fileName = req.file.filename;
        req.body.size = req.file.size;
        req.body.extension = req.body.fileName.split('.')[1];  */
        
        //console.log(req.body);
        let fileDir = req.file.destination;
        fileDir = fileDir.split('public')[1];
        const fileName = req.file.filename;
        const size = req.file.size;
        const extension = fileName.split('.')[1]; 

        let json = { 'fileDir':fileDir, 'fileName':fileName, 'size':size, 'extension':extension };
        console.log(json);
        //return await fileService.insertFile(req, res);
        return await res.json(json);
    }catch(err) {
        console.log(err);
    }
}

/* 파일 insert */
const insertFile = async function(req, res){
    try {
        /* let boardId = req.body.boardId;
        let oldPath = 'public'+req.body.fileDir; //  public/images/upload/board/bc_1/u_1/temp
        // public/images/upload/bc_1/u_1/b_1
        let newPath = `${oldPath.split('/temp')[0]}/b_${boardId}/`;
        req.body.newPath = newPath;

        //폴더명 변경 temp -> b_1(boardId) 폴더로
        fs.rename(oldPath, newPath, function(err){
            if(err) console.log(err);
        }); */

        return await fileService.insertFile(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 파일 삭제 */
const deleteFile = async function(req, res){
    try {
        console.log('deleteFile:::')
        //console.log(req)
        let filePath = req.body.filePath;
        console.log('filePath:::');
        console.log(filePath);

        let folderPath = filePath.substring(0, filePath.lastIndexOf('/')-1);
        console.log('folderPath:::'+folderPath);

        const removeImgPath = 'public\\'+filePath;
        
        //기존 이미지 삭제
        fs.unlink(removeImgPath, (err) => {
            if (err) {
                console.error(err)
                return;
            }   

            //빈 디렉토리 삭제
            /* const realFolderPath = 'public\\'+folderPath;
            fs.readdir(realFolderPath, (err, files) => {
                if( files.length === 0 ){
                    fs.unlink(realFolderPath, (err) => {
                        if(err) console.log(err); return;
                    });
                }
            }); */

        });
        
        //return await fileService.deleteFile(req, res);
        return await res.json(0);
    }catch(err) {
        console.log(err);
    }
}

/* 파일 조회 */
const selectFileByBoardId = async function(req, res){
    try {
        return await fileService.selectFileByBoardId(req, res);
    }catch(err) {
        console.log(err);
    }
}

/* 파일 데이터 삭제 */
const deleteFileData = async function(req, res){
    try {
        return await fileService.deleteFileData(req, res);
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    uploadFile: uploadFile,
    insertFile: insertFile,
    deleteFile: deleteFile,
    selectFileByBoardId: selectFileByBoardId,
    deleteFileData: deleteFileData,
};
