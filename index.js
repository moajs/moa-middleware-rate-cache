/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var debug = require('debug')('rate-cache');

module.exports = function (redis, uni_key, timeout) {
  this.uni_key = uni_key;
  this.timeout = timeout;
  this.redis   = redis;
  
  var _this = this;
  
  function log(key, timeout){
    console.log('【LOG】: key=' + key + ' - timeout=' + timeout)
  }
  var middleware = function (req, res, next) {
    
    log(_this.uni_key, _this.timeout);
    
    this.uni_key = _this.uni_key;
    this.timeout = _this.timeout;
    this.redis   = _this.redis;
    this.next = next;
  	_this.redis.get(_this.uni_key, function(err, value) {
  		if(err) {
        console.log(_this.uni_key + ' 不存在')
        console.log('get ' + _this.uni_key +' expire error');
  			return res.status(200).json({
  				data: {},
  				status: {
  				  code: -1,
  				  msg: '生成货单编号失败'
  				}
  			});
  		}else if(value == _this.uni_key ){
        console.log('get ' + _this.uni_key +' expire exist');
  			return res.status(200).json({
  				data: {},
  				status: {
  				  code: -2,
  				  msg: '您的订单已经在处理，不要急嘛~'
  				}
  			});
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