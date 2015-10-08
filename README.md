# rate-cache


is an expressjs middleware!


```
npm install --save rate-cache
```

## Examples

```
var redis = new ioredis();
var rate_cache = require('rate-cache')(redis, 'xxxxx_key', 40);


app.get('/', rate_cache, function (req, res) {
  
  rate_cache.mark_key_exist();
  
  res.send('Hello World!');
});
```