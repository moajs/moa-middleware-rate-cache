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
var rate_cache = require('moa-middleware-rate-cache');
var r = new rate_cache(redis, 'xxxxx_key', 40);
```

参数

- redis, 传入redis对象
- 'xxxxx_key', 在redis里缓存的key
- 40（秒）缓存时间

way 2：

```
var rate_cache = require('moa-middleware-rate-cache');
var r = new rate_cache(redis, 'xxxxx_key2222');
```

参数

- redis, 传入redis对象
- 'xxxxx_key', 在redis里缓存的key

默认缓存时间是30秒
 
## result message

- rate_cache.msg_not_exist

```
{
	data: {},
	status: {
	  code: -1,
	  msg: '生成货单编号失败'
	}
}
```

- rate_cache.msg_exist

```
{
	data: {},
	status: {
	  code: -2,
	  msg: '您的订单已经在处理，不要急嘛~'
	}
}
```

如果想重置就直接修改rate_cache即可。

## Extra API

- rate_cache.set_uni_key(new_key)
- rate_cache.mark_key_exist()

## Examples

由于rate-cache依赖redis，所以推荐luin写的[ioredis](https://github.com/luin/ioredis)

```
var Redis = require('ioredis');
var redis = new Redis();
var rate_cache = require('moa-middleware-rate-cache');
var r = new rate_cache(redis, 'xxxxx_key', 40);

app.get('/', r.middleware, function (req, res) {
  r.mark_key_exist();
  
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
var rate_cache = require('moa-middleware-rate-cache');
var r2 = new rate_cache(redis,'xxxxx_key111');

var rate_cache_config = function(req, res, next){
  var user_id = req.current_user._id;
  r2.uni_key = user_id + "_create_delivery"
  
  next();
}

app.get('/', rate_cache_config, r2.middleware, function (req, res) {
  r2.mark_key_exist();
  
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