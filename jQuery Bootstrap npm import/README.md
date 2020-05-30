## npm으로 jQuery/Bootstrap import
  
### 1. 해당 프로젝트 경로에서 jQuery/Bootstrap npm 설치
```
$ npm i jquery
$ npm i bootstrap
```

### 2. back-end 에 모듈 경로 설정
```
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); //npm jquery 경로 설정
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js')); //npm bootstrap js 경로 설정
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css')); //npm bootstrap css 경로 설정
```

### 3. front-end 에서 import
```
<link rel="stylesheet" href="/bootstrap/bootstrap.min.css">                 <!-- bootstrap css -->
<script type="text/javascript" src="/bootstrap/bootstrap.min.js"></script>  <!-- bootstrap js -->
<script type="text/javascript" src="/jquery/jquery.min.js"></script>        <!-- jquery -->
```
