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
    , currentTime = new Date().getTime()
    currentTime = Math.floor(currentTime/1000)
    
    var script = '\
      local current \
      current = redis.call("incr", KEYS[1]) 
      current = redis.call("hincrby",KEYS[1], ARGV1[2], 1) \
      if tonumber(current) == 1 then \
        redis.call("hset" KEYS[1], "firstRequestTime", ARGV[2]) \
      end \
    '
    this.client.eval(script, lookup, "count", currentTime, function (err, res) { 
      console.log("ERRRRRRRRRR   " + err) 
      console.log(res)
    })   
         ////.expire(lookup, _this.expire) 
         ////.exec(function (err, replies) { 
         //   if (err) console.log(err) 
         //   replies.forEach(function(reply){ console.log(reply) })
         // })
    // we should also make this key expire so we dont hold data from years ago
    // default to an hour from now
}

Ratelimit.prototype.getCountTime = function (usedID, route, cb) { 
  if (typeof(route) === 'function'){
    cb = route
    route = null
  }
  var lookup = this.makeKey(userID, route)
  this.client.hmget(lookup, "count", "time",  function (err, replies){
    if (err) cb(err, null) 
    cb(null, replies[0], replies[1])
  }) 
}

//get the users total clicks on thier routes
Ratelimit.prototype.getTotal = function (userID, cb) { 
  var total
  //  , multi = this.client.multi() 
  //multi.keys
  var _this = this
  var lookup = this.makeKey(userID)
  this.keys(lookup + ":*", function (err, replies) { 
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
  else return this.namespace + ':' + userID + ':' + route 
}

var x = new Ratelimit()
x.add("faiq")
