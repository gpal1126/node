
### express 설치
```
npm i express --save
```

### ejs 설치
```
npm i ejs --save
```

### mysql 설치
```
npm i mysql --save
```

### passport, 로그인, session, 메시지 관련 설치
```
npm i passport passport-local express-session connect-flash --save
```
  
### REST
- 자원을 URI로 표시하고 HTTP 메서드를 통해서 자원의 상태를 주고받는 것  
- 자원 : URI / 행위 : HTTP 메서드 / 표현 으로 구성  
- GET/POST/PUT/DELETE  
- 플랫폼에 종속되지 않고 사용 가능, 상태 정보 유지를 안한다, 캐시 가능  
  
### RESTful API
- REST 기반을 표준으로 설계된 API  
- HTTP protocol 기반  
- 자원을 URI로 표현하며, 고유해야 한다.  
- HTTP Methods를 활용하여 구분  
- xml/json을 활용하여 데이터 전송  
- 복수명사 사용 ex) /movies  
- URL에 하위 자원 표현 ex) /movies/23  
- 필터조건 허용 가능 ex) /movies?state=active  
  
URL                 Methods     설명
/movies             GET         모든 영화 리스트 가져오기
/movies             POST        영화 추가
/movies/:title      GET         해당 title 영화 가져오기
/movies/:title      DELETE      해당 title 영화 삭제
/movies/:title      PUT         해당 title 영화 수정
/movies?min=9       GET         상영중인 영화리스트(필터조건)
