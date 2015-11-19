/**
 * Created by MMY on 2015/11/19.
 */
//获取微博和保存微博
var mongodb = require('./db');
function Post(username, post, time) {
    this.user = username;
    this.post = post;
    if (time) {
        this.time = time;
    }
    else {
        var now=new Date();
        this.time =now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getSeconds();
    }
}
module.exports = Post;
//保存微博到数据库
Post.prototype.save = function save(callback) {
    //存入MongoDB数据库
    var post = {
        user: this.user,
        post: this.post,
        time: this.time
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合，即表
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //为user属性添加索引
            collection.ensureIndex('user');
            //写入post文档
            collection.insert(post, {safe: true}, function (err, post) {
                mongodb.close();
                callback(err, post);
            });
        });
    });
};
//获取全部或指定用户的微博记录
Post.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //查找user属性为username的微博记录，如果username为null则查找全部记录
            var query = {};
            if (username) {
                query.user = username;
            }
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                //封装posts为Post对象
                var posts = [];
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};