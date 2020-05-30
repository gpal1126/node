const local = require('./localStrategy');
const naver = require('./naverStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    //5. passport.serializeUser 호출
    passport.serializeUser((user, done) => {    //Strategy 성공시 호출 / req.session 객체에 담을 데이터
        done(null, user.user_id); //6. 세션에 user_id만 저장, done(에러, user index 값) / user_id 값이 deserializeUser의 첫번째 매개변수로 이동
    });

    //7. passport.deserializeUser 호출
    passport.deserializeUser((user_id, done) => {   //세션에 저장된 유저 id 값을 통해 유저 정보 get / passport.session() 미들웨어가 호출 / 매개변수 user_id는 serializeUSer done의 인자가 값으로 받은 것 
        User.findOne({ where: { user_id } })    //8. user_id 값을 통해 유저 정보 select
        .then( user => done(null, user))    //9. req.user에 정보 저장
        .catch( err => done(err) );
    });

    local(passport);
    naver(passport);
}