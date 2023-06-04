var express = require('express');
var router = express.Router();

const UserModel = require('../../models/UserModel');
const md5 = require('md5');
//导入 jsonwebtokan
const jwt = require('jsonwebtoken');
//读取配置项
const { secret } = require('../../config/config');

// 登录操作
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let {username,password} = req.body;
    // 查询数据库
    UserModel.findOne({username:username,password:password}).then((data) => {
        
        // 判断 data，如果用户名或密码输错，那么data是null，反之校验成功返回object
        // console.log(data);
        if(!data){
            res.json({
                code: '2002',
                msg: '用户名或密码错误~~',
                data: null
            })
        }else{
            // 创建当前用户的token
            let token = jwt.sign({
                username: data.username,
                _id:data._id
                }, secret, {
                expiresIn: 60 * 60 * 24 * 7 //单位是 秒，这里设置7天
                })
                
            // 响应token
            res.json({
                code: '0000',
                msg: '登录成功',
                data: token
            })
        }
    }).catch(() => {
        res.json({
            code: '2001',
            msg: '数据库读取失败~~',
            data: null
        })
    })
})

// 退出登录
router.post('/logout', (req, res) => {
    // 销毁 session
    req.session.destroy(() => {
        res.render('success', { msg: '退出成功啦~', url: '/login' });
        });
})


module.exports = router;
