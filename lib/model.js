//a thing that adds to redis, and increments counts
var redis = require('redis') 

function Ratelimit(expire) { 
  this.namespace = 'ratelimit'
  this.client = redis.createClient()
  this.expire = expire || (60 * 60)
}

Ratelimit.prototype.add = function (userID, route) { 
  var _this = this
    , lookup = this.makeKey(userID, route)
    , multi = this.client.multi()
  this.client.hincrby(lookup, "count", function (err, res) { 
    if (res == 1) { //first time incrementing this field 
      var currentTime = new Date.getTime()
      currentTime = currentTime/1000 
      _this.client.hset(lookup, "firstRequestTime", currentTime)
    } 
    // we should also make this key expire so we dont hold data from years ago
    // default to an hour from now
    _this.client.expire(lookup, expire) 
  }
}

Ratelimit.prototype.getCount = function (usedID, route, cb) { 
  if (typeof(route) === 'function'){
    cb = route
    route = null
  }
  var lookup = this.makeKey(userID, route)
  this.client.hmget(lookup, "count", function (err, replies){
    if (err) cb(err, null) 
    cb(null, replies[0])
  }) 
}

//get the users total clicks on thier routes
Ratelimit.prototype.getTotal = function (userID, cb) { 
  var total
  //  , multi = this.client.multi() 
  //multi.keys
  var _this = this
  this.keys(namespace + ":" + userID + ":*", function (err, replies) { 
    if (err) cb(err, null)
    replies.forEach(function (reply) { 
      _this.client.hmget(reply, "count", function (err, replies) { 
        total += replies[0] 
      })
      cb (null, total)
    }) 
  })
}

Ratelimit.prototype.makeKey = function (userID, route) { 
  if (!route) return this.namespace + ':' + userID
  else return this.namespace + ':' + userID + ':' route 
}

var x = new Ratelimit()
x.add("faiq")
x.getCount("faiq", function
