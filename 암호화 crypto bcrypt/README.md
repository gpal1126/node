## 암호화 crypto / bcrypt  

## crypto : 암호화 관련 모듈  
### 1. 단방향 암호화​ : 복호화 할 수 없는 암호화, 해시 기법 이용  
- 해시 기법 : 문자열을 고정된 길이의 다른 문자열로 변환  
    -  createHash(알고리즘) : md5, sh1, sha256, sha512 등의 해시 알고리즘을 넣어 해시 생성  
    - update(패스워드) : 변환할 문자를 넣어준다.  
    - digest(인코딩) : base64, hex, 등 인코딩할 알고리즘을 넣어준다.  
```
const crypto = require('crypto');
var password = crypto.createHash('sha512').update('1234').digest('base64');
```

### pbkdf2를 이용한 단방향 암호화, salt를 생성하여 반복 작업 해시  ㄴ
- 회원의 비밀번호를 복호화할 필요 없으니 단방향 암호화를 사용했음  
```
//랜덤으로 64바이트 길이의 문자열인 salt 생성
const password = '1234';
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:::'+salt);
    
    //기존 password + salt를 sha512로 100000번 반복 해쉬하여 64바이트 길이의 암호화 생성
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
        password = key.toString('base64');  //base64 문자열로 변환
        //console.log('password:::'+ password);
    });
});
​
```

### 2. 양방향 암호화 : 키(key)를 이용한 암호화, 복호화 가능
- 1) 대칭형 암호화  
- 2) 비대칭형 암호화  
  
- 대칭형 암호화  
    - 암호화  
    - crypto.createCipher(알고리즘, 키): 알고리즘과 키를 이용하여 암호화 생성  
    - cipher.update(패스워드, 인코딩, 출력 인코딩) : 암호화할 패스워드, 인코딩, 출력 인코딩을 넣어준다.  
    - cipher.final(출력인코딩) : 암호화 완료  
  
    - 복호화  
    - crypto.createDecipher(알고리즘, 키): 알고리즘과 키를 이용하여 복호화 생성  
    - decipher.update(패스워드, 인코딩, 출력 인코딩) : 암호화할 패스워드, 인코딩, 복호화할 인코딩을 넣어준다.  
    - decipher.final(출력인코딩) : 복호화 완료  
```
const crypto = require('crypto');
const key = '열쇠';
const password = '패스워드 값';

//암호화
const cipher = crypto.createCipher('aes-256-cbc', key);
let rst1 = cipher.update(password , 'utf8', 'base64');
console.log('암호화:', rst1);  //MHenvO9eoqYJ88AlNgZj
rst1 += cipher.final('base64');
console.log('암호화:', rst1);  //MHenvO9eoqYJ88AlNgZjd+IYry5TUw2WtspLZuPYw/o=

//복호화
const decipher = crypto.createDecipher('aes-256-cbc', key);
let rst2 = decipher.update(rst1, 'base64', 'utf8');
rst2 += decipher.final('utf8');
console.log('복호화:', rst2);  //패스워드 값
```

## bcrypt : 암호화 관련 모듈
- 회원가입시 비밀번호 암호화  
- 두번째 인자 값 범위 12~31(클수록 해시가 강화된다.)  
```
//bcrypt를 이용한 암호화, hash를 이용하여 간단하지만 보안성이 강하다, 두번째 인자값은 반복 횟수와 비슷하다 12~31까지 사용 가능
bcrypt.hash(password, 12, function(err, hash){
    console.log(hash);
    ...생략
});
```
  
- 로그인시 암호화된 비밀번호 체크  
```
const bcrypt = require('bcrypt');   //암호화 관련 모듈

//비밀번호 해시 비교
const rst = await bcrypt.compare(password, exUser.password);
```
