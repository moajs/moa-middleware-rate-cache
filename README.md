# rate-cache

moa-middleware-rate-cache is an expressjs-based middleware!

[![npm version](https://badge.fury.io/js/moa-middleware-rate-cache.svg)](http://badge.fury.io/js/moa-middleware-rate-cache)

## Install

```
$ npm install --save moa-middleware-rate-cache
```

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