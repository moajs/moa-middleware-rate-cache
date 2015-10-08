# rate-cache

moa-middleware-rate-cache is an expressjs-based middleware!

## Install

```
$ npm install --save moa-middleware-rate-cache
```

## Examples

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