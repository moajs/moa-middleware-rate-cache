/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var debug = require('debug')('rate-cache');

module.exports = function (redis, uni_key, timeout) {
  var redis, uni_key, timeout;
  
  if (arguments.length >= 3) {
    redis = arguments[0];
    uni_key = arguments[1];
    timeout = arguments[2];
  }else if (arguments.length == 2) {
    redis = arguments[0];
    timeout = arguments[1];
    uni_key = req.rate-cache_key;
  }else if (arguments.length == 1) {
    redis = arguments[0];
    timeout = req.rate-cache_timeout;
    uni_key = req.rate-cache_key;
  }else{
    redis = req.redis;
    timeout = req.rate-cache_timeout;
    uni_key = req.rate-cache_key;
  }
  
  this.uni_key = uni_key;
  this.timeout = timeout;
  this.redis   = redis;
  
  if (this.uni_key || this.timeout || this.redis) {
    console.log('Moa-middleware-rate-cache Usages!')
    console.log("var rate_cache = require('moa-middleware-rate-cache')(redis, 'xxxxx_key', 40);")
    console.log("var rate_cache = require('moa-middleware-rate-cache')(redis, 40);")
    console.log("var rate_cache = require('moa-middleware-rate-cache')(redis);")
    return;
  }
  
  var _this = this;
  
  function log(key, timeout){
    console.log('【LOG】: key=' + key + ' - timeout=' + timeout)
  }
  
  var middleware = function (req, res, next) {
    
    log(_this.uni_key, _this.timeout);
    
    var msg_not_exist = {
			data: {},
			status: {
			  code: -1,
			  msg: '生成货单编号失败'
			}
		}
    
    var msg_exist = {
			data: {},
			status: {
			  code: -2,
			  msg: '您的订单已经在处理，不要急嘛~'
			}
		}
    
    if (req.rate_cache_msg_not_exist) {
      not_exist = req.rate_cache_msg_not_exist;
    }
    
    if (req.rate_cache_msg_exist) {
      not_exist = req.rate_cache_msg_exist;
    }
    
    this.uni_key = _this.uni_key;
    this.timeout = _this.timeout;
    this.redis   = _this.redis;
    this.next = next;
  	_this.redis.get(_this.uni_key, function(err, value) {
  		if(err) {
        console.log(_this.uni_key + ' 不存在')
        console.log('get ' + _this.uni_key +' expire error');
  			return res.status(200).json(msg_not_exist);
  		}else if(value == _this.uni_key ){
        console.log('get ' + _this.uni_key +' expire exist');
  			return res.status(200).json(msg_exist);
      }else{
        console.log('get ' + _this.uni_key +' expire not exist, 保存到数据库里');
        if(value == null || value == 'null' || value == undefined){
          console.log(_this.uni_key + ' 存在')	
    			_this.next();
        }
  		};
  	});
  };
  
  middleware.prototype.mark_key_exist = function (){
    console.log('mark_key_exist...');
    log(_this.uni_key, _this.timeout);
    
    this.redis.multi()
    .set(this.uni_key, this.uni_key)
    .expire(this.uni_key, this.timeout,function(){
      console.log('out');
    })
    .exec(function(err) {
      if(err) {
        console.error("Failed to publish EXPIRE EVENT for " + content);
        console.error(err);
        return;
      }
    });
  }
  
  return middleware;
};