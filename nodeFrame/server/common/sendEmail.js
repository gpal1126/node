
const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer'); //이메일 관련 모듈
const cache = require('memory-cache');  //메모리 캐시 모듈

const emailId = process.env.EMAIL;
const emailPwd = process.env.EMAIL_PWD;

//이메일 발송 common func
router.sendEmail = async function(req, res){
    try {
        const html = req.body.html;
        const subject = req.body.subject;
        //console.log(html);
        const email = req.body.email;

        //console.log('sendEmail html:::'+html);
        //console.log('sendEmail subject:::'+subject);
        console.log('sendEmail email:::'+email);
        
        const smtpTransport = nodemailer.createTransport({
            service: 'gmail'
            //,prot : 587
            ,prot : 465
            ,host :'smtp.gmlail.com'
            ,secure : true
            ,requireTLS : true
            ,auth: {
                user: emailId, //회사 계정 이메일
                pass: emailPwd,   //회사 계정 비밀번호
                //https://www.google.com/settings/security/lesssecureapps 보안설정 사용으로 변경해야됨 
            },
        });

        const mailOptions = {
            from: 'murame<'+emailId+'>',
            to: email,
            subject: subject,
            html: html,
        }

        smtpTransport.sendMail(mailOptions, function(err, res){
            if(err){
                console.log(err);
            }else {
                console.log('Message sent:'+res.message);
            }
            smtpTransport.close();
        });
        
        return 1;

    }catch(err) {
        console.log(err);
    }  
}

/* 인증번호 요청 */
router.reqAthntNo = function (req, res) {

    const subject = '인증번호 관련 메일입니다.';

    //랜덤 6자리 인증번호
    const random = Math.floor(100000 + Math.random() * 900000);
    console.log('random:::'+random);
    const content = `인증번호는 [${random}]입니다.`;

    //console.log(html);
    const email = req.body.email;

    console.log('sendEmail email:::'+email);
    
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail'
        //,prot : 587
        ,prot : 465
        ,host :'smtp.gmlail.com'
        ,secure : true
        ,requireTLS : true
        ,auth: {
            user: emailId,      //계정 이메일
            pass: emailPwd,   //계정 비밀번호
            //https://www.google.com/settings/security/lesssecureapps 보안설정 사용으로 변경해야됨 
        },
    });

    const mailOptions = {
        from: 'murame<'+emailId+'>',
        to: email,
        subject: subject,
        //html: '<a href="http://localhost:3000/d_users/certifiedEmail?email='+email+'">인증하기</a>',
        html: content,
    }

    smtpTransport.sendMail(mailOptions, function(err, res){
        if(err){
            console.log(err);
        }else {
            console.log('Message sent:'+res.message);
        }
        smtpTransport.close();
    });

    //이메일과 인증번호 push 후 3분 뒤에 메모리 삭제
    cache.put(`${email}`, `${random}`, 180000, function(key, value) {
        console.log(key + ' did ' + value);
    }); // Time in ms 
    console.log('인증번호:::'+cache.get(`${email}`));
    
    res.json(1);
};

module.exports = router;