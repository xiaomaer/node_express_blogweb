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

var session = require('express-session');//session使用
var MongoStore = require('connect-mongo')(session);//mongodb使用
var settings = require('./settings');
var flash = require('connect-flash');//req.flash()使用


//创建项目实例
var app = express();

// view engine setup
//设置模板引擎的位置和格式
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
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


//提供session支持
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db,
    })
}));
//视图交互
app.use(function(req, res, next){
    console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
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
