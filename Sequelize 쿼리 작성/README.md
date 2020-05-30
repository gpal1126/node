##  Sequelize 쿼리 작성하기
  
### insert   
- mysql insert  
```
const db = require('../db/db_base');    //db 정보
const query = 'INSERT INTO USER_TB(id, password, name, secretkey, reg_date) VALUES(?, ?, ?, ?, NOW())';
db.client.query(query, [id, password, name, secretkey], function(err, rst){
    ...생략   
});
```
- sequelize insert  
```
const { User } = require('../models');  //스키마 연결
User.create({
    id: id,
    password: password,
    name: name,
    secretkey: secretkey,
}).then( rst => {
    ... 생략
}).catch( err => {
    console.error('err::::');
    console.error(err);
});
```

### select    
- select  
```
const db = require('../db/db_base');    //db 정보
const query = 'SELECT * FROM USER_TB WHERE user_id=?';
db.client.query(query, [user_id], function(err, rst){
    ...생략
});
```

- sequelize select  
    - findAll : 멀티 row 값 select 값이 없으면 빈 배열 값이 return 된다!  
```
const { User } = require('../models');  //스키마 연결
//멀티 로우 검색시 
User.findAll({
    attributes: [ 'id', 'name' ],
    where: {
        user_id: userId,
    }
}).then(rst => {
    if( rst.length !== 0 ){ //이미 있으면 
        //값이 있을 때
    }else { //없으면
        //값이 없을 때
    }
}).catch(err => {
    //에러
});
```
-   
    - findOne : 하나의 row 값(limit 1)  select, 값이 없으면 null로 return 된다!  
```
const { User } = require('../models');  //스키마 연결
User.findOne({
    attributes: [ 'user_id', 'id', 'name' ],
    where: {
        deleted: 0,
    }
}).then(rst => {
    if( rst !== null ){ //이미 있으면 
        //값이 있을 때
    }else { //없으면
        //값이 없을 때
    }
}).catch(err => {
    console.error(err);
    //next(err);
});
```
- findAll, findOne 사용하면서 값이 없을 때의 return 값이 서로 다르다.  
  
  
### update  
- mysql update  
```
const db = require('../db/db_base');    //db 정보
const query = 'UPDATE USER_TB SET name=? WHERE user_id=?';
db.client.query(query, [name, userId], function(err, rst){
    ...생략
});
```

- sequelize update  
```
const { User } = require('../models');  //스키마 연결
User.update({
    name: name,
}, {
    where: { user_id: userId },
}).then( rst => {
    ...생략
}).catch( err => {
    console.error(err);
});
```
  

### delete 생략  
- 모든 정보를 로그로 남겨야 하기 때문에 delete는 사용하지 않았다.  
- mysql delete  
```
const db = require('../db/db_base');    //db 정보
const query = 'DELETE FROM USER_TB WHERE user_id=?';
db.client.query(query, [userId], function(err, rst){
    ...생략
});
```

- sequelize destroy  
```
const { User } = require('../models');  //스키마 연결
User.destroy({
    where: { user_id: userId },
}).then( rst => {
    ...생략
}).catch( err => {
    console.error(err);
});
```

### findOrCreate : 조회 후 값이 없으면 insert
- spread() : 값이 있으면 기존 값 return  
             값이 없으면 새로운 값 return  
```
Page.findOrCreate({
    defaults: {
        user_id: userId,
        title: title,
        contents: contents,
    },
    where : {
        user_id: userId,
    }
}).spread((rst, created) => {
    if( created ){
        console.log('새로운 rst:::'+rst.dataValues);
    }else {
        console.log('기존 rst:::'+rst.dataValues);
    }
}).catch((err) => {
     console.error(err);
});
```
