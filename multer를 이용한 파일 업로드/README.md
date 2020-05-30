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

#### Storage 
- diskStorage :  파일을 디스크에 저장하기 위한 모든 제어 기능을 제공  
- memoryStorage : 파일을 메모리에 buffer로 저장, 옵션 없음  
  
  
#### diskStorage 옵션 
- destination : 파일을 저장할 폴더 경로, 경로 설정 전 폴더가 있는지 확인하기  
- filename : 파일의 이름 지정  

#### multer 옵션
| Key | Description |
|---|---|
|**dest or storage**| 파일이 저장될 위치 |
|**fileFilter**| 어떤 파일을 허용할지 제어하는 함수 |
|**limits**| 업로드 된 데이터의 한도, 제한 지정하면 Dos로부터 보호 |
|**preservePath**| 파일의 base name 대신 보존할 파일의 전체 경로 |
  
​  
#### limits 옵션
| 속성 | 설명 | 기본값 |
|**fieldNameSize**| 필드명 사이즈 최대값 | 100 bytes |
|**fieldSize**|필드값 사이즈 최대값|1MB|
|**fields**|파일형식이 아닌 필드의 최대 개수|무제한|
|**fileSize**|multipart 형식 폼에서 최대 파일 사이즈(bytes)|무제한|
|**files**|multipart 형식 폼에서 파일 필드의 최대 개수|무제한|
|**parts**|For multipart forms, the max number of parts (fields + files)|무제한|
|**headerPairs**|multipart 형식 폼에서 파싱할 헤더의 key=>value 쌍의 최대 개수|2000|

##### * 유저 정보 수정 컨트롤러 (프로필 파일 업로드)  
- multer 미들웨어를 두번째 인자에 넣는다.  
- multer는 request에 body 객체(폼 텍스트 필드)와 file 객체가 담겨 있다.  

```
const upload= require('../../common/upload'); //파일 업로드 공통 func

router.put('/modifyUserInfo', upload.single('profile'), function(req, res){
    //기존 이미지
    const dbImgPath = req.body.dbImgPath;
    console.log('dbImgPath:::'+dbImgPath);
    const profilUpdateChk = JSON.parse(req.body.profilUpdateChk);   //프로필 업데이트 했는지 체크 
    console.log('profilUpdateChk:::'+profilUpdateChk);

    //기존 이미지가 no_profile.png 가 아니면서 프로필 수정 했을 경우 기존 이미지 삭제
    if(  !dbImgPath.includes('no_profile.png') && profilUpdateChk ){
        const removeImgPath = 'public\\'+dbImgPath;
        //기존 이미지 삭제
        fs.unlink(removeImgPath, (err) => {
            if (err) {
              console.error(err)
              return
            }   
            //file removed
        });
    }
   
    return userCntrl.modifyUserInfo(req, res);
});
```

#### * 업로드 제어 옵션
- upload.single('profile') : req.file 객체에 한 개의 파일 업로드  
- upload.array('photos') : req.files 객체에 한 개의 속성, 여러 개의 파일 업로드 / 파일 정보를 배열로 담음  
- upload.fields({ name: 'profile', maxCount: 1 }, {name : 'photos', maxcount: 8})  : req.files 객체(String -> Array 형태)에 여러 개의 속성, 한 개 또는 여러 개의 파일 업로드 / key : 필드명, value : 배열 형태의 파일 정보  
- upload.none() : 파일 업로드 없이 텍스트 데이터만 multipart 형식으로 전송했을 경우  

​
#### * 파일 정보
- 컨트롤러단에서 req.file 객체에서 file 정보 객체가 출력된다.  
```
{ fieldname: 'cropImg',
  originalname: 'profile.png',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'public/images/upload/profile/',
  filename: 'profile_45_1562341520754.png',
  path: 'public\\images\\upload\\profile\\profile_45_1562341520754.png',
  size: 126735 }
```


| Key | Description | Note |
|**fieldname**|폼에 정의된 필드 명| |
|**originalname**|사용자가 업로드한 파일 명| |
|**encoding**|파일의 엔코딩 타입| |
|**mimetype**|파일의 Mime 타입| |
|**size**|파일의 바이트(byte) 사이즈| |
|**destination**|파일이 저장된 폴더|DiskStorage|
|**filename**|destination 에 저장된 파일 명|DiskStorage|
|**path**|업로드된 파일의 전체 경로|DiskStorage|
|**buffer**|전체 파일의 Buffer|MemoryStorage|

