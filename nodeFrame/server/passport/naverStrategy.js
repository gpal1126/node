const NaverStrategy = require('passport-naver').Strategy;
const bcrypt = require('bcrypt');   //암호화 모듈
require('dotenv').config();  //.env 파일의 환경변수 설정 / 암호화로 처리

const { User } = require('../models');
const { Sns } = require('../models');

module.exports = (passport) => {
    passport.use(new NaverStrategy({    //3. passport 전략 수행
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        svcType: 0 
    }, async (accessToken, refreshToken, userInfo, done) => {
        try {
            console.log(userInfo);
            const snsId = userInfo.id;
            const snsType = userInfo.provider;
            const snsName = userInfo.displayName;
            const snsEmail = userInfo.emails[0].value;
            console.log('snsEmail:::'+snsEmail);

            const snsUserId = snsEmail.split('@')[0];
            console.log('snsUserId::::'+snsUserId);

            //const exUser = await Sns.findOne({ where: { id: id } });
            const exConnect = await User.findOne({ //Sns id 값으로 User, Sns 조인해서 조회
                include: [{
                    model: Sns,
                    where: {
                        id: snsId,     //sns id로 검색
                    }
                }]
            });

            console.log('exConnect');
            //console.log(exConnect);
            console.log('accessToken:::');
            console.log(accessToken);
            console.log('refreshToken:::');
            console.log(refreshToken);
            //const exUser = await User.findOne({ where: { id: id } });
            if( exConnect ){   //이미 연동
                console.log('이미 연동');
                done(null, exConnect); //로그인 성공
            }else { //새로 연동

                const exUser = await User.findOne({ where: { email: snsEmail } });  //snsEmail 값이 User 테이블의 이메일과 일치하면 기존 회원
                if( exUser ) {  //기존 회원이 네이버 아이디 연동
                    console.log('기존 회원이 네아로 연동');
                    Sns.create({    //sns 정보 추가
                        id: snsId,
                        type: snsType,
                        name: snsName,
                        email: snsEmail,
                    }).then( snsInfo => {
                        console.log('snsInfo::::');
                        //console.log(snsInfo);
    
                        if( snsInfo !== undefined ){
                            //console.log(snsInfo);
                            //console.log(snsInfo.id);
                            User.update({   //공통 컬럼인 email로 조회하여 sns 인덱스 업데이트
                                sns_id: snsInfo.sns_id, //sns 인덱스 업데이트
                                mod_date: new Date(), //sns 인덱스 업데이트
                            }, {
                                where: { email: snsEmail }, //이메일로 조회
                            }).then( upUser => {
                                console.log('upUser');
                                //console.log(upUser);
                                User.findOne({ 
                                    where : { sns_id: snsInfo.sns_id } 
                                }).then( upUserRst => {
                                    console.log(upUserRst);
                                    done(null, upUserRst); //로그인 성공
                                });
                            }); 
                            
                        }
                    }).catch( err => {
                        console.log('err::::');
                        console.log(err);
                    });
                }else {                 //네아로로 최초 가입한 회원
                    console.log('네아로로 최초 가입한 회원');
                    Sns.create({    //sns 정보 추가
                        id: snsId,
                        type: snsType,
                        name: snsName,
                        email: snsEmail,
                    }).then( snsInfo => {
                        console.log('snsInfo::::');
                        //console.log(snsInfo);
    
                        if( snsInfo !== undefined ){
                            //console.log(snsInfo);
                            //console.log(snsInfo.id);
                            User.create({   //유저 정보 추가
                                id: snsUserId,
                                name: snsName,
                                email: snsEmail,
                                sns_id: snsInfo.sns_id, //sns 인덱스
                            }).then( newUser => {
                                done(null, newUser); //로그인 성공
                            });
    
                        }
                    }).catch( err => {
                        console.log('err::::');
                        console.log(err);
                    });
                }
                
            }
            
        }catch (err){
            console.error(err);
            done(err);
        }
    }));
}