## 메모리 캐시 

### 메모리 캐시 모듈 설치
```
$ npm i memory-cache
```

### * 메모리 캐시 기본적인 메서드
- put(key, value, time, function) : key, value로 push(time, function: 옵션)  
    - 1) cache.put(key, value)  
    - 2) cache.put(key, value, time, function(){}) : 캐시 생성 후 time 뒤 삭제  
        - get(key) : 해당 key의 캐시 값 가져옴  
        - del(key) : 해당 key의 캐시 값 삭제  
        - clear : 모든 캐시 삭제  
  
### * 적용 예제
- cache 에 key, value로 값 set, get  
```
const cache = require('memory-cache');    //메모리 모듈

cache.put('key', 'value');    //캐시 key, value로 넣기
console.log(cache.get('key')); //캐시 get하기
```

#### 1. key, value 생성 뒤 1초 뒤에 출력 후 캐시 삭제
```
cache.put('key', 'value', 1000, function(key, value) {
    console.log(key + ' did ' + value);     //1초 뒤에 출력
});
console.log(cache.get('key')); //value

setTimeout(function() {
    console.log('key is ' + cache.get('key'));    //null
}, 2000);

/*
value
key did value
null
*/
```

#### 2. key 따로 생성 후 del로 삭제
```
cache.put('key', 'value');    //캐시 생성
console.log(cache.get('key')); 

setTimeout(function() {
    console.log('1초 뒤 삭제???');
    cache.del('key');     //해당 key 캐시 삭제
}, 1000);

setTimeout(function() {
    console.log('null??'+cache.get('key'));
}, 2000);

/*
value
1초 뒤 삭제???
null??null
*/
```