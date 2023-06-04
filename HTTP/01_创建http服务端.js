// 导入模块
const http = require('http');
const fs = require('fs');

// 创建服务对象；当收到 HTTP 请求的时候就会执行回调函数
// (如何发请求：用浏览器URL向指定端口发送请求)
const server=http.createServer((request, response)=>{
    // 获取请求方法和路径
    const {method, url}=request;
    // 设置响应头，防止响应体中文乱码
    response.setHeader('content-type','text/html;charset=utf-8');
    // 判断，对不同url响应不同页面
    if(method==='GET'&&url==='/login'){
        // 响应一个 4 行 3 列的表格，并且要求表格有 隔行换色效果 ，且 点击 单元格能 高亮显示
        let html = fs.readFileSync(__dirname + '\\01_table.html'); // 同步读取返回的是buffer
        response.end(html); // end方法可以接收buffer或者字符串
    }else if(method==='GET'&&url==='/reg'){
        response.end('注册页面');
    }else{
        response.end('Not found');
    }
})

// 监听端口，启动服务
server.listen(9000,()=>{
    console.log('服务已经启动....') // 在启动服务后打印
});