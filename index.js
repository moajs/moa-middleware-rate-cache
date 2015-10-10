/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var debug = require('debug')('rate-cache');

module.exports = function () {
  var redis
    , uni_key
    , timeout = 30;
  
  if (arguments.length >= 3) {
    redis = arguments[0];
    uni_key = arguments[1];
    timeout = arguments[2];
  }else if (arguments.length == 2) {
    redis = arguments[0];
    uni_key = arguments[1];
  }else if (arguments.length == 1) {
    redis = arguments[0];
  }else {
    // redis = req.redis;
    // timeout = req.rate-cache_timeout;
    // uni_key = req.rate-cache_key;
    console.log('参数不足')
    return;
  }
  
  this.uni_key = uni_key;
  this.timeout = timeout;
  this.redis   = redis;
  this.debug   = true;
    
  this.msg_not_exist = {
		data: {},
		status: {
		  code: -1,
		  msg: '生成货单编号失败'
		}
	}

  this.msg_exist = {
		data: {},
		status: {
		  code: -2,
		  msg: '您的订单已经在处理，不要急嘛~'
		}
	}
    
  var _this = this;
  // console.log(redis)
  log(_this.uni_key, _this.timeout);
  
  /**
   * connect middleware for check if key in redis
   */
  this.middleware = function (req, res, next) {
    if (_this.uni_key == undefined) {
      console.error('rate_cache.uni_key是必须要设置的！')
      return res.status(200).json({
    		data: {},
    		status: {
    		  code: -119,
    		  msg: 'rate_cache.uni_key是必须要设置的！'
    		}
      });
    }
    
    console.log('middleware mouting...')
    
    this.uni_key  = _this.uni_key;
    this.timeout  = _this.timeout;
    this.redis    = _this.redis;
    this.next     = next;

    log(_this.uni_key, _this.timeout);
  
    this.uni_key = _this.uni_key;
    this.timeout = _this.timeout;
    this.redis   = _this.redis;
    this.next = next;
    var __this = this;
    
  	__this.redis.get(__this.uni_key, function(err, value) {
  		if(err) {
        console.log(__this.uni_key + ' 不存在' + _this.msg_not_exist)
        console.log('get ' + __this.uni_key +' expire error');
        if (_this.debug){
          _this.msg_not_exist['data']['uni_key'] = _this.uni_key;
          _this.msg_not_exist['data']['timeout'] = _this.timeout;
          _this.msg_not_exist['data']['debug'] = _this.debug;
        }
  			return res.status(200).json(_this.msg_not_exist);
  		}else if(value == __this.uni_key ){
        console.log('get ' + _this.uni_key +' expire exist' + _this.msg_exist);
        if (_this.debug){
          _this.msg_exist['data']['uni_key'] = _this.uni_key;
          _this.msg_exist['data']['timeout'] = _this.timeout;
          _this.msg_exist['data']['debug'] = _this.debug;
        }
        
  			return res.status(200).json(_this.msg_exist);
      }else{
        console.log('get ' + __this.uni_key +' expire not exist, 保存到数据库里');
        if(value == null || value == 'null' || value == undefined){
          console.log(__this.uni_key + ' 存在')	
    			__this.next();
        }
  		};
  	});
  };
  
  /**
   * 设置uni_key
   */
  this.set_uni_key = function (k) {
    this.uni_key = k;
  }
  
  /**
   * 设置redis里的uni_key和超时时间
   */
  this.mark_key_exist = function () {
    console.log('mark_key_exist...');
    log(this.uni_key, this.timeout);
  
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

  function log(key, timeout){
    console.log('【LOG】: key=' + key + ' - timeout=' + timeout)
  }
  
  return this;
};