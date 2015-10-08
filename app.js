var express = require('express');
var app = express();

var Redis = require('ioredis');
var redis = new Redis();

var rate_cache = require('./index')(redis, 'xxxxx_key', 40);


app.get('/', rate_cache, function (req, res) {
  var cache = new rate_cache();
  cache.mark_key_exist();
  
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
});