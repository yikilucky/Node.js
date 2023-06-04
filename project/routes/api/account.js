// 导入 express
const express = require('express');

const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

var router = express.Router();

// 记账本的列表
router.get('/account', checkTokenMiddleware, function (req, res, next) {
    // 获取所有的账单信息
    // let accounts = db.get('accounts').value();
    AccountModel.find().sort({ time: -1 }).then((data) => {
        //响应成功的提示
        res.json({
            //响应编号
            code: '0000',
            //响应的信息
            msg: '读取成功',
            //响应的数据
            data: data
        });
    }).catch(() => {
        res.json({
            code: '1001',
            msg: '读取失败~~',
            data: null
        });
    })
});

/* // 添加记录
router.get('/account/create', function (req, res, next) {
    res.render('create');
}); */

// 新增记录
router.post('/account', checkTokenMiddleware, function (req, res) {
    // 获取请求体数据
    // console.log(req.body);
    // 还可以再搞个表单验证(看每一条数据是否有问题，比如我们设置的title是必填项，如果没填就返回特定的错误编号)
    AccountModel.create({
        ...req.body,
        time: new Date(req.body.time)
    }).then((data) => {
        //成功提醒
        res.json({
            code: '0000',
            msg: '创建成功',
            data: data
        })
    }).catch(() => {
        res.json({
            code: '1002',
            msg: '创建失败~~',
            data: null
        })
    })

});

// 删除记录
router.delete('/account/:id', checkTokenMiddleware, function (req, res) {
    //获取 params 的 id 参数
    let id = req.params.id;
    //删除
    AccountModel.deleteOne({ _id: id }).then(() => {
        //提醒
        res.json({
            code: '0000',
            msg: '删除成功',
            data: {}
        })
    }).catch(() => {
        res.json({
            code: '1003',
            msg: '删除账单失败',
            data: null
        })
    })
});

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取 id 参数
    let { id } = req.params;
    //查询数据库
    AccountModel.findById(id).then((data) => {
        //成功响应
        res.json({
            code: '0000',
            msg: '读取成功',
            data: data
        })
    }).catch(() => {
        res.json({
            code: '1004',
            msg: '读取失败~~',
            data: null
        })
    })
})

//更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取 id 参数值
    let { id } = req.params;
    //更新数据库
    AccountModel.updateOne({ _id: id }, req.body).then(()=>{
        //再次查询数据库 获取单条数据
        AccountModel.findById(id).then((data)=>{
            //成功响应
            res.json({
                code: '0000',
                msg: '更新成功',
                data: data
            })
        }).catch(()=>{
            res.json({
                code: '1004',
                msg: '读取失败~~',
                data: null
            })
        })
    }).catch(()=>{
        res.json({
            code: '1005',
            msg: '更新失败~~',
            data: null
        })
    })
})

    module.exports = router;
