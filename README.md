# rate-cache

moa-middleware-rate-cache is an expressjs-based middleware!

[![npm version](https://badge.fury.io/js/moa-middleware-rate-cache.svg)](http://badge.fury.io/js/moa-middleware-rate-cache)

## Install

```
$ npm install --save moa-middleware-rate-cache
```

## Usages

way 1：

```
var rate_cache = require('moa-middleware-rate-cache')(redis, 'xxxxx_key', 40);
```

参数

- redis, 传入redis对象
- 'xxxxx_key', 在redis里缓存的key
- 40（秒）缓存时间

way 2：

```
req.rate-cache_key = 'xxxxx_key';
var rate_cache = require('moa-middleware-rate-cache')(redis, 40);
```

参数

- redis, 传入redis对象
- 40（秒）缓存时间

way 3：

```
req.rate-cache_timeout = 30;
req.rate-cache_key = 'xxxxx_key';
var rate_cache = require('moa-middleware-rate-cache')(redis);
```

参数

- redis, 传入redis对象

way 4：

```
var Redis = require('ioredis');

req.redis = new Redis();
req.rate-cache_timeout = 30;
req.rate-cache_key = 'xxxxx_key';
var rate_cache = require('moa-middleware-rate-cache')();
```

参数

- 无

## Examples

由于rate-cache依赖redis，所以推荐luin写的[ioredis](https://github.com/luin/ioredis)

```
var Redis = require('ioredis');
var redis = new Redis();
var rate_cache = require('moa-middleware-rate-cache')(redis, 'xxxxx_key', 40);

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
```

上面是最典型的场景，xxxxx_key是针对某一个表或者某一个操作的key，还有一种更为苛刻的，比如根据表单内容或者某个用户，使用中间件配置即可


```
var Redis = require('ioredis');
var redis = new Redis();
var rate_cache = require('moa-middleware-rate-cache')(redis);

var rate_cache_config = function(req, res, next){
  var user_id = req.current_user._id;
  req.rate-cache_key = user_id + 'xxxxx_key';
  req.rate-cache_timeout = 40;
  next();
}

app.get('/', rate_cache_config, rate_cache, function (req, res) {
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
```

redis内存用量查看： https://github.com/sripathikrishnan/redis-rdb-tools