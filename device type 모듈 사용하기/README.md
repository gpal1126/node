## device type 모듈 사용하기

### express-device 모듈 설치  
```
$ npm install express-device 
```

### 메인 서버에 모듈 선언
```
const device = require('express-device'); //device 관련(device type별로 구분) 
app.use(device.capture());
```

### device type 별로 분기처리 
```
let deviceType = req.device.type.toUpperCase(); //device type
console.log('deviceType::::::::::::::::::::::::::::::::::::::'+deviceType);
if( deviceType === 'DESKTOP' ){
    deviceType = 'pc';
}else if( ['TABLET', 'PHONE'].includes(deviceType) ){
    deviceType = 'mobile';
}else {
    deviceType = 'web';
}//if
```