var redis = require('redis').createClient()
  , path = require('path') 
  , redback = require('redback')

module.exports = Ratelimit 

function Ratelimit (options) { 
  if (!options) {
    this.bucket_interval = 1 
    this.bucket_span = 3600  
    this.subject_expiry = 3600 //expire the next hour, no sooner
    this.routes =  "*" //work for all routes
    this.key = 'remoteAddress' //special key you identify user with defaults to thier remote address
    this.limit = 3000 
  }
  var _this = this
  redis.on('error', function (error) { 
    return function (req, res, next) { 
      next(error) 
    } //return somemiddleware that just throws an error object 
  })
  
  if (!this.rateLimit) { 
    redback.use(redis) 
    this.rateLimit = redback.createRateLimit('requests', {
      bucket_interval: _this.bucket_interval,
      bucket_span: _this.bucket_span,
      subject_expiry: _this.subject_expiry 
    })
  }
  return this.add()
} 

Ratelimit.prototype.add = function () { 
  var _this = this
  return function (req, res, next) { 
    var key = _this.makeKey(path.basename(req.originalUrl))
    rateLimit.add(ip) 
    rateLimit.count(ip, 20, function (err, count) { 
      if (count > 1) { 
        console.log('more dan 1')
        res.end('tooo many') 
      } else next() 
    })
  }
}

// make a key for each user:route that comes in
Ratelimit.prototype.makeKey = function (route) {
  return this.key + ':' route  
}
