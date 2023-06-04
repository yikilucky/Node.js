//1. 安装 mongoose
//2. 导入 mongoose
const mongoose = require('mongoose');

//3. 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/bilibili');

//4. 设置连接回调
//连接成功
mongoose.connection.once('open', () => {
    console.log('连接成功');
    //5. 创建文档结构对象
    let BookSchema = new mongoose.Schema({
        title: String,
        author: String,
        price: Number
    });
    //6. 创建文档模型对象            mongoose 会使用集合名称的复数来创建集合
    let BookModel = mongoose.model('book', BookSchema);
    //7. 插入文档
    BookModel.create({
        title: '西游记',
        author: '吴承恩',
        price: 19.9
    }).then(data=>console.log(data)).catch(err=>console.log(err))
});
//连接出错
mongoose.connection.on('error', () => {
    console.log('连接出错~~');
})
//连接关闭
mongoose.connection.on('close', () => {
    console.log('连接关闭');
})
