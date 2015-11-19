/**
 * Created by MMY on 2015/11/18.
 */
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host,27017, {}), {safe: true});//mongodb数据库服务器的默认端口号:27017