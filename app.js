var express = require('express');
var app = express();

var Redis = require('ioredis');
var redis = new Redis();

app.get('/', function (req, res) {
  var a = [
    '<a href=\'http://127.0.0.1:3010/1\'>example 1 </a>',
    '<a href=\'http://127.0.0.1:3010/2\'>example 2 </a>',
    '<a href=\'http://127.0.0.1:3010/3\'>example 3 </a>',
    '<a href=\'http://127.0.0.1:3010/4\'>example 4 </a>'
  ]
  res.send(a.join(' | '));
});


var rate_cache = require('./index');

// example 1
var r = new rate_cache(redis, 'xxxxx_key 1', 40);

app.get('/1', r.middleware, function (req, res) {
  r.mark_key_exist();
  
  res.status(200).json({
    data:{},
    status:{
      code: 0,
      msg : 'success!'
    }
  });
});

// example 2
var r2 = new rate_cache(redis,'xxxxx_key111');

app.get('/2',function(req, res, next){
  var user_id = 'req.current_user._id';
  r2.uni_key = user_id + "_create_delivery"
  
  next();
}, r2.middleware, function (req, res) {
  // console.log(r2.uni_key);
  // var cache = new rate_cache1(req);
  r2.mark_key_exist();

  res.status(200).json({
    data:{
      demo:1
    },
    status:{
      code: 0,
      msg : 'success!'
    }
  });
});

// example 3
var r3 = new rate_cache(redis);

app.get('/3', r3.middleware, function (req, res) {
  r3.mark_key_exist();
  
  res.status(200).json({
    data:{},
    status:{
      code: 0,
      msg : 'success!'
    }
  });
});


// example 3
var r4 = new rate_cache(redis);

app.get('/4', function(req, res, next) {
  var user_id = 'example 3 sucess';
  r4.uni_key = user_id + "_create_delivery"
  
  next();
}, r4.middleware, function (req, res) {
  r4.mark_key_exist();
  
  res.status(200).json({
    data:{},
    status:{
      code: 0,
      msg : 'success!'
    }
  });
});

var server = app.listen(3010, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  
  var open = require("open");
  open("http://127.0.0.1:3010");
});