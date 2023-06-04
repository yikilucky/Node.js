// 导入 express
const express = require('express');

/* // 导入lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// 数据保存到db.json里
const adapter = new FileSync(__dirname + '/../data/db.json');
// 获取db对象
const db = low(adapter);
// 导入shortid
const shortid = require('shortid'); */

const AccountModel = require('../../models/AccountModel');

// 导入中间件检测登录
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

// 创建路由对象
const router = express.Router();

// 添加首页路由规则
router.get('/', function(req, res, next) {
  res.redirect('/account');
});

// 记账本的列表
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  // 获取所有的账单信息
  // let accounts = db.get('accounts').value();
  AccountModel.find().sort({time:-1}).then((data)=>{
    res.render('list',{accounts:data});
  }).catch(()=>{
    res.status(500).send('插入失败~');
  })
});

// 添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

// 新增记录
router.post('/account', checkLoginMiddleware, function(req, res) {
  // 获取请求体数据
  // console.log(req.body);
  // db.get('accounts').unshift({id:shortid.generate(),...req.body}).write();
  AccountModel.create({
    ...req.body,
    time:new Date(req.body.time)
  }).then(()=>{
    res.render('success',{msg:'添加成功啦~',url:'/account'});
  }).catch(()=>{
    res.status(500).send('插入失败~');
  })
  
});

// 删除记录
router.get('/account/:id', checkLoginMiddleware, function(req, res) {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  AccountModel.deleteOne({_id:id}).then(()=>{
    res.render('success',{msg:'删除成功啦~',url:'/account'});
  }).catch(()=>{
    res.status(500).send('删除失败~');
  })
});


module.exports = router;
