const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({  //서버에 저장
    destination: function(req, file, cb) {
        //console.log(file);
        //console.log(req);
        console.log('upload.js');
        //console.log(file);
        //console.log(req.body);

        const fileDirType = req.body.fileDirType;
        const folderId = JSON.parse(req.body.folderId);
        //console.log(folderId)
        let userId;
        if( req.user !== undefined ){   //임시 방편
            userId = req.user.user_id;
        }
        
        //category
        let folderName1;
        let dir;
        if( fileDirType === 'board' ){  
            //ex) board/bc_1(boardCatId)/u_1(userId)/temp
            boardCatId = folderId.bcId;
            boardId = folderId.bId;
            folderName1 = `bc_${boardCatId}`;
            folderName2 = `u_${userId}`;
            folderName3 = `b_${boardId}`;
    
            dir = `public/images/upload/${fileDirType}/${folderName1}/${folderName2}/${folderName3}`;
        }else if( fileDirType === 'product' ){
            oId = folderId;
            let orderType = req.body.orderType;
            folderName1 = `u_${userId}`;
            folderName2 = `o_${oId}`;
    
            dir = `public/images/upload/agent/${orderType}/${fileDirType}/${folderName1}/${folderName2}`;
        }

        /* 폴더 없을 경우 하위폴더까지 모두 생성 */
        mkdirp(dir, function(err){
            if(err) console.log(err);
            cb(null, dir+'/');  //이미지 폴더 경로
        });

    },
    filename: function(req, file, cb) {
        //console.log(file);
        const ext = path.extname(file.originalname);
        let uploadFile;

        uploadFile = path.basename(file.originalname, ext) + '_' + new Date().valueOf() + ext;
        //const uploadFile = path.basename(file.originalname, ext) + '_' + new Date().valueOf() + ext;
        cb(null, uploadFile);
    }
    //limit: { fileSize: 5 * 1024 * 1024},
});

module.exports = multer({ storage: storage });
