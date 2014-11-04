var redis = require('redis').createClient()
  , redback = require('redback').use(redis)

module.exports = function (options) { 
  return function (req, res, next) { 
    if (!options)  {
      options = {
        bucket_interval: 1, 
        bucket_span:  3600,  
        subject_expiry: 200
      }
    } 
    console.log('b4 creating redis thing') 
    var rateLimit = redback.createRateLimit('requests', options)
      , ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log('after redis thing')
    rateLimit.add(ip) 
    rateLimit.count(ip, 20, function (err, count) { 
      if (count > 1) { 
        console.log('more dan 1')
        res.end('tooo many') 
      } else next() 
    })
  }
} 
