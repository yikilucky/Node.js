// 导入模块
const http = require('http');
const fs = require('fs');
const path = require('path');
//声明一个变量
let mimes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    json: 'application/json'
}

// 创建服务对象；当收到 HTTP 请求的时候就会执行回调函数
// (如何发请求：用浏览器URL向指定端口发送请求)
const server = http.createServer((request, response) => {
    // 如果请求方法不是GET就立马响应405
    if (request.method !== 'GET') {
        response.statusCode = 405;
        response.end('<h1>405 Method Not Allowed</h1>');
        return;
    }
    // 获取请求url的路径
    const { url } = request;
    // 静态资源目录(网站根目录)
    const root = __dirname + '/02_page';
    // 拼接文件路径
    const filePath = root + url;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // console.log(err);
            //设置字符集
            response.setHeader('content-type', 'text/html;charset=utf-8');
            //判断错误的代号
            switch (err.code) {
                case 'ENOENT':
                    response.statusCode = 404;
                    response.end('<h1>404 Not Found</h1>');
                    break;
                case 'EPERM':
                    response.statusCode = 403;
                    response.end('<h1>403 Forbidden</h1>');
                    break;
                default:
                    response.statusCode = 500;
                    response.end('<h1>Internal Server Error</h1>');
            }
            return; // 防止下面的end执行
        }
        //获取文件的后缀名
        let ext = path.extname(filePath).slice(1); // 一开始获得.html，要不包含点，就要slice处理一下
        //获取对应的类型
        let type = mimes[ext];
        if (type) {
            //匹配到了                          text/html;charset=utf-8
            if (ext === 'html') {
                response.setHeader('content-type', type + ';charset=utf-8'); // 设置响应头字符集的优先级是高于html文件中的meta标签的
            } else {
                // 上面对html设置字符集之后，对CSS还有JS就没必要再设置了，在网页中会根据网页的字符集进行解析
                response.setHeader('content-type', type);
            }
        } else {
            //没有匹配到
            response.setHeader('content-type', 'application/octet-stream');
        }
        // 响应文件内容
        response.end(data);
    })
})

// 监听端口，启动服务
server.listen(9000, () => {
    console.log('服务已经启动....') // 在启动服务后打印
});