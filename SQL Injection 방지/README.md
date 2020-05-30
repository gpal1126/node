## SQL Injection
- 클라이언트의 입력 값을 조작하여 SQL을 주입함으로서 서버의 데이터베이스를 공격하는 방식  

## * SQL Injection 예시
### SQL Injection 1 : 로그인창에 입력하기

```
//로그인창에 아이디/비밀번호 입력
id: admin
pw: ' OR '1'='1

//서버로 쿼리 요청
password '' 안에 ' OR '1'='1이 들어감
SELECT * FROM user_tb WHERE id='admin' AND password=' ' OR '1' = '1';
```
- AND 연산이 OR  연산보다 우선순위가 높기 때문에 쿼리 구문은 true를 반환하여 id와 password가 매치가 안되더라도 로그인을 성공하여 값을 반환한다. (보안에 취약)  
  
  
### SQL Injection 2 : 주소창의 파라미터를 이용하여 쿼리 주입하기
- 주소창에 입력  
localhost:8080?id=1; DROP TABLE user;  
```
//서버로 쿼리 요청
SELECT * FROM tb1 WHERE id=1; DROP TABLE user;
```
- SQL은 기본적으로 Multiple Statement를 지원하여 SELECT 구문 다음인 DROP 구문도 실행된다.(보안에 취약)  
  
  
## * SQL Injection 예방

### 예방 1 : MultipleStatements를 false로 설정하기
- Node.js에서 지원하는 mysql connection 부분에서 MultipleStatements를 false로 지정해준다.  
  
### 예방 2 : 
- 위험한 코드 방식 : 권장 안함  
```
db.query(`SELECT * FROM tb1 WHERE id = ${id}`, function(rst, err) ...생략
//요청된 쿼리
//SELECT * FROM tb1 WHERE id=1; DROP TABLE user;
```
  
- 보안된 코드 방식 : db.escape를 이용  
```
db.query(`SELECT * FROM tb1 WHERE id = ${db.escape(id)}`, function(rst, err) ...생략
//요청된 쿼리 '' 묶여 string으로 인식
//SELECT * FROM tb1 WHERE id='1; DROP TABLE user';
```
  
- 보안된 코드 방식 : ?(인자 값) 이용  
```
db.query(`SELECT * FROM tb1 WHERE id = ?`, [id] function(rst, err) ...생략
//요청된 쿼리 '' 묶여 string으로 인식
//SELECT * FROM tb1 WHERE id='1; DROP TABLE user';
```
