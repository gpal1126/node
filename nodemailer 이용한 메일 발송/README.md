## nodemailer를 이용한 이메일 발송
- 사용 전 해당 이메일의 보안 설정 사용으로 변경해주기!  
- https://www.google.com/settings/security/lesssecureapps  


### nodemailer 모듈 설치
```
$ npm i nodemailer
```

### sendEmail.js 
```
const nodemailer = require('nodemailer'); //이메일 발송 관련 모듈

const smtpTransport = nodemailer.createTransport({
service: 'gmail',
    auth: {
        user: '계정 이메일',     //이메일
        pass: '계정 비밀번호',   //비밀번호
        //https://www.google.com/settings/security/lesssecureapps 보안설정 사용으로 변경해야됨 
    },
});
  
const mailOptions = {
    from: '보낸사람이름<보낸사람이메일>',
    to: '받는사람이메일',
    subject: '제목',
    html: '내용',  //태그를 이용하여 꾸며줄 수 있음.
}

smtpTransport.sendMail(mailOptions, function(err, res){
    if(err){
        console.log(err);
    }else {
        console.log('Message sent:'+res.message);
    }
    smtpTransport.close();
});
```