## fs 모듈 설치
```
$ npm i fs
```

### 파일 쓰기 : writeFile
```
const fs = require('fs');

fs.writeFile('파일 이름', '파일 내용',function(err){      
    if(err) console.log('Error' + err);
    console.log('파일이 생성되었습니다.');
});
```

### 파일 읽기
- readFile : 비동기(순서가 다름)
```
fs.readFile('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('1:::'+data.toString());
});

fs.readFile('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('2:::'+data.toString());
});

fs.readFile('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('3:::'+data.toString());
});

/*
비동기 형식 순서가 다름
2::: 파일2
1::: 파일1
3::: 파일3
*/
```

- readFileSync : 동기(순서대로 실행)
```
const fs = require('fs');

fs.readFileSync('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('1:::'+data.toString());
});

fs.readFileSync('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('2:::'+data.toString());
});

fs.readFileSync('읽을 파일 경로', (err, data) => {
    if(err){
        throw err;
    }
    console.log('3:::'+data.toString());
});

/*
동기 형식 순서대로 실행
1::: 파일1
2::: 파일2
3::: 파일3
*/
```

### 파일 삭제 : unlink
```
const fs = require('fs');

fs.unlink('삭제할 파일 경로', (err) => {
    if (err) console.error(err);
    console.log('파일이 삭제되었습니다.');
});
```

### 폴더 생성 : mkdir
```
const fs = require('fs');

fs.mkdir('생성할 폴더 경로',0666,function(err){
    if(err) throw err;
    console.log('새로운 폴더를 만들었습니다.');
});
```

### 하위 폴더까지 모두 생성 : mkdirp
```
const mkdirp = require('mkdirp');

/* 폴더 없을 경우 하위폴더까지 모두 생성 */
mkdirp('생성할 폴더 경로', function(err){
    if(err) console.log(err);
});
```

### 폴더명 변경 : rename
```
let oldPath = `public/images/oldFolder`;
let newPath= `public/images/newFolder`;

fs.rename(oldPath, newPath, function(err){
    if(err) console.log(err);
});
```

### 폴더 제거 : rmdir
```
const fs = require('fs');

fs.rmdir('삭제할 폴더 경로',function(err){
    if(err) throw err;        
    console.log("폴더가 삭제 되었습니다.")          
});
```
