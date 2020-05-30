## multer
- multipart/form-data를 이용하여 파일 업로드를 하는 미들웨어  
- 효율성을 최대화 하기 위한 busboy 기반  
- body 객체에 폼 텍스트 필드/file 객체 한 개 or 여러개를 request 에 추가  

​
### multer 설치
```
$ npm i multer
```

### front-end script에서 formData 형식으로 서버로 보낸다.
```
//script
const fd = new FormData();
fd.append('nickname', nickname);
fd.append('dbImgPath', dbImgPath);
fd.append('profile', profile);
fd.append('profilUpdateChk', profilUpdateChk);

url = '/d_users/updateUserInfo';
type = 'POST';
data = fd;
        
rst = ajaxFunc(url, type, data);
alert('정보수정이 완료되었습니다.');
```

### multer 미들웨어 
```
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({  //서버에 파일 저장 관리
    destination: function(req, file, cb) {

        let dir = 'public/images/upload/profile';

        /* 폴더 없을 경우 하위폴더까지 모두 생성 */
        mkdirp(dir, function(err){
            if(err) console.log(err);
            cb(null, dir+'/');  //이미지 폴더 경로
        });
    },
    filename: function(req, file, cb) { //파일의 이름을 지정
        console.log(file);
        const userId = req.user.user_id;
        const ext = path.extname(file.originalname);    //확장자
        const uploadFile = path.basename(file.originalname, ext) + '_' + new Date().valueOf() + ext;
        cb(null, uploadFile);
    }
});

//파일의 허용 범위 체크
const fileFilter = function(req, file, callback) {
	var ext = path.extname(file.originalname)
	if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
		return callback(res.end('Only images are allowed'), null)
	}
	callback(null, true)
}

module.exports = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limit: { fileSize: 5 * 1024 * 1024}, 
});
```

