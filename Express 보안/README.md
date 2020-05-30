## Express 보안

### 1. 더이상 사용되지 않거나 취약성이 있는 버전 사용 중지
- Express 2.x or 3.x 버전은 유지보수를 더 이상 하지 않으므로 사용 중단하고 버전 업데이트 하기  
  
### 2. TLS 사용
  
### 3. Helmet 사용
- Helmet 모듈 설치
```
$ npm install --save helmet
```
- 보안 관련 HTTP 헤더 설정  

```
const helmet = require('helmet');
app.use(helmet());
```
  
### 4. X-Powered-By 헤더는 사용하지 않도록 설정
```
app.disable('x-powered-by');
```

#### 4. 쿠키 안전하게 사용
- express-session(세션 ID만 저장)이 cookie-session(세션 전체를 저장)보다 안전  
- 쿠키 보안 옵션 설정​  
    - name: 기본 세션 쿠키 이름 사용하지 않고 name 설정해주기  
    - secret: 암호화하여 생성 하기  
    - secure : HTTPS를 통해서만 쿠키 전송 가능  
    - httpOnly : 클라이언트가 JavaScript가 아닌 HTTP(S)를 통해서만 전송되도록, XSS 공격으로부터 보호  
    - domain : 쿠키의 도메인 표시. 도메인이 일치하는 경우  
    - path : 쿠키의 경로 표시. 도메인과 경로가 일치하는 경우 쿠키 전송  
    - expires : 쿠키의 만기 날짜 설정  
  
```
const session = require('express-session'); //세션
app.set('trust proxy', 1)
app.use(session({
    resave: true,
    saveUninitialized: false,
    name: 'sessionId',    //기본 세션 쿠키 이름 사용하지 않고 ﻿name 설정해주기
    secret: process.env.COOKIE_SECRET,  //.env 파일에서 암호화하여 생성
    cookie: {
        secure: false,  // HTTPS를 통해서만 쿠키를 전송하도록 함(true시 네이버 로그인시 에러..)
        httpOnly: true, //클라이언트 JavaScript가 아닌 HTTP(S)를 통해서만 전송되도록
        //domain: '', //쿠키의 도메인을 표시
        //path : '',  //쿠키의 경로를 표시
        //expires: expiryDate //만기 날짜를 설정
    },
}));
```

#### 5. 종속 항목이 안전한지 확인
- npm audit를 이용해서 의존성 트리 검사  
```
$ npm audit
```
  
- Snyk를 이용한 보안 강화  
    - snyk 설치 후 프로젝트로 이동  
```
$ npm install -g snyk
$ cd nodeFrame
```
  
- 취약점 검사  
```
$ snyk test
```

- 취약점을 고치는 패치나 업데이트 받는 설치 마법사 실행  
```
$ snyk wizard
```
