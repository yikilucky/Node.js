var express = require('express');
var router = express.Router();

const UserModel = require('../../models/UserModel');
const md5 = require('md5');

// 注册页面
router.get('/reg', (req, res) => {
    // 模版引擎响应 HTML 内容
    res.render('auth/reg');
})

// 提交注册
router.post('/reg', (req, res) => {
    // 可以做表单验证(skip)
    // 获取请求体数据
    // console.log(req.body);
    UserModel.create({
        ...req.body,
        password:md5(req.body.password)
    }).then(() => {
        res.render('success', { msg: '注册成功啦~', url: '/login' });
    }).catch(() => {
        res.status(500).send('注册失败，请稍后再试~');
    })
})

// 登录页面
router.get('/login', (req, res) => {
    // 模版引擎响应 HTML 内容
    res.render('auth/login');
})

// 登录操作
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let {username,password} = req.body;
    // 查询数据库
    UserModel.findOne({username:username,password:password}).then((data) => {
        
        // 判断 data，如果用户名或密码输错，那么data是null，反之是object
        // console.log(data);
        if(!data){
            res.send('账号或密码错误~')
        }else{
            //设置session
            req.session.username = data.username;
            req.session.id = data._id; 
            // 登录成功响应
            res.render('success', { msg: '登录成功啦~', url: '/account' });
        }
    }).catch(() => {
        res.status(500).send('登录，请稍后再试~');
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
