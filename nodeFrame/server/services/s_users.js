/*** Service : 데이터 처리 ***/
'use strict'; //엄격모드

//const db = require('../db/db_base');    //db 정보
//const User = require('../models').User;  //스키마 연결

const Sequelize = require('sequelize');
const { sequelize } = require('../models');  //스키마 연결
const { User } = require('../models');  //스키마 연결

/* 회원 가입 */
const insertUser = async function(req, res){
    try {

        console.log('회원가입 :::');
        const id = req.body.id;
        const password = req.body.password;
        const name = req.body.name;
        const secretkey = req.body.secretkey;
        console.log('secretkey:::'+secretkey);

        User.create({
            id: id,
            password: password,
            name: name,
            secretkey: secretkey,
        }).then( rst => {
            if( rst !== undefined ){
                res.json(1);
            }
        }).catch( err => {
            console.error('err::::');
            console.error(err);
        });
    }catch(err) {
        console.log(err);
    }
};

/* 유저 정보 조회 */
const selectUserInfoById = async function(req, res){
    try {
        console.log('유저 정보 조회')
        let userId;
        if( req.user !== undefined ){
            userId = req.user.user_id;
    
            User.findAll({
                attributes: [ 'user_id', 'id', 'password', 'name', [Sequelize.fn('date_format', Sequelize.col('reg_date'), '%Y.%m.%d %H:%i'), 'reg_date'] ],
                where: {
                    user_id: userId,
                }
            }).then((rst) => {
                //console.log(rst);

                const user_id = rst.user_id;
                const id = rst.id;
                const name = rst.name;
                const json = { 'uId': user_id, 'id':id, 'name':name, 'regdate':reg_date };

                res.json(json);
            }).catch((err) => {
                console.log(err);
                //next(err);
            });
        }else {
            res.json(0);
        }
    }catch(err) {
        console.error(err);
    }
};

/* 유저 정보 수정 */
const updateUserInfo = async function(req, res){
    try {
        //const userId = parseInt(req.query.userId);
        //console.log(req.user);
        let userId;
        if( req.user !== undefined ){
            userId = req.user.user_id;
            const name = req.body.name;

            User.update({
                name: name,
                mod_date: new Date(),
            }, {
                where: {
                    user_id: userId,
                }
            }).then( rst => {
                if( rst !== undefined ){
                    res.json(1);
                }
            }).catch( err => {
                console.error(err);
            });
        }
    }catch(err) {
        console.error(err);
    }
};

/* 회원 탈퇴 */
const deleteUser = async function(req, res){
    try {
        let userId;
        if( req.user !== undefined ){
            userId = req.user.user_id;
            
            const deleted = 1;  //회원 탈퇴 유무 

            User.update({
                deleted: deleted,
                del_date: new Date(),
            }, {
                where: {
                    user_id: userId,
                }
            }).then( rst => {
                if( rst !== undefined ){
                    res.json(1);
                }
            }).catch( err => {
                console.error(err);
            });
        }
    }catch(err) {
        console.error(err);
    }
};

module.exports = {
    insertUser: insertUser,
    selectUserInfoById: selectUserInfoById,
    updateUserInfo: updateUserInfo,
    deleteUser: deleteUser,
};