//加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//加载路由控制
var routes = require('./routes/index');
//var users = require('./routes/users');

//使用时新添加的，上面的依赖包是创建文件时自带的。
var settings = require('./settings');//数据库连接
//session会话
var session = require('express-session');//session使用
var MongoStore = require('connect-mongo')(session);//mongodb使用
//引入 flash 模块来实现页面通知
var flash = require('connect-flash');//req.flash()使用

//process.setMaxListeners(0);//不能解决(node) warning: possible EventEmitter memory leak detected. 11 reconnect listeners added. Use emitter.setMaxListeners() to increase limit.
//自己添加的

//创建项目实例
var app = express();

// view engine setup
//设置模板引擎的位置和格式
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//新添加
app.use(flash());//定义使用 flash 功能

// uncomment after placing your favicon in /public
//定义网页标签中显示的图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//定义cookie解析器
app.use(cookieParser());
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


//自己添加的，提供session支持
app.use(session({
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失。
    store: new MongoStore({
        db: settings.db,
    })
}));
//自己添加的
// 视图交互：实现用户不同登陆状态下显示不同的页面及显示登陆注册等时的成功和错误等提示信息
app.use(function(req, res, next){
    console.log("视图交互");
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
    //显示错误信息
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();//控制权转移，继续执行下一个app。use()
});
//定义匹配路由
app.use('/', routes);//指向了routes目录下的index.js文件
//app.use('/users', users);//指向了routes目录下的users.js文件

// catch 404 and forward to error handler
//404错误处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//开发模式，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
//生产模式，500错误处理
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//输出模型app
module.exports = app;
