//a thing that does middleware logic
var path = require('path') 
  , Ratelimit = require('./model') //logic for the structure we're putting in things

module.exports = Middleware

function Middleware (options) {
  this.key = options.key || 'ip'
  this.window = options.window ||  3600
  if (!options.total_limit && !options.limit_object) throw Error("you need to pass in either a total limit or limit object for each route you want to limit") 
  if (options.total_limit && !options.limit_object) {
    this.total_limit = options.total_limit
    this.rateLimitList = new Ratelimit(this.window) 
    return this.checkLimit()  
  } else if (options.limit_object && !options.total_limit) { 
    this.limit_object = options.limit_object
    this.rateLimitList = new Ratelimit(this.window) 
    return this.checkRouteLimit()
  } else {
    //the hard case, i haven't figured out how to do yet 
    return function (req,res,next) { 
      next()
    }
  } 
}

Middleware.prototype.checkLimit = function () { 
  var _this = this 
  
  return function (req, res, next) {
    var key
    if (_this.key === 'ip') { 
      key = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      _this.RateLimitList.add(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    } else { 
      key = req.session[_this.key]
    } 
    //how do i make sure these two don't race/is this a race condition?
    _this.RateLimitList.add(key) 
    _this.rateLimitList.getCountTime(key, function (err, count, firstRequest) { 
      res.header('X-RateLimit-Limit', _this.total_limit) 
      var end = true
      if (count >= limit) { 
        res.header('X-RateLimit-Remaining', 0)
      } else {
        res.header('X-RateLimit-Remaining', limit-count)
        end = false
      } 
      res.header('X-RateLimit-Reset', firstRequest + 6000) 
      if (end) res.end("You hit this too many times") 
      else next() 
    })
  }
}
