const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');   //암호화 모듈

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({    //3. passport 전략 수행
        usernameField: 'id',        //view에서 넘어온 id 값
        passwordField: 'password',  //view에서 넘어온 password 값
    }, async (id, password, done) => {
        try {
            //유저 정보 조회
            const exUser = await User.findOne({ where: { id: id } });

            if( exUser ){   //유저 정보가 있으면
                //비밀번호 해시 비교
                const rst = await bcrypt.compare(password, exUser.password);

                if( rst ){  //비밀번호 일치
                    done(null, exUser); //로그인 성공
                }else { //비밀번호 불일치
                    done(null, false, { message: 'mis_pwd' });
                }
            }else { //유저 정보 없음
                done(null, false, { message: 'no_user' });
            }
        }catch (err){
            console.error(err);
            done(err);
        }
    }));
}