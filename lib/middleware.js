//a thing that does middleware logic
var path = require('path') 

module.exports = Ratelimit 

function Ratelimit (options) {
  this.key = options.key || 'ip'
  this.window = options.window ||  3600
  if (!options.total_limit && !options.limit) throw Error("you need to pass  
} 

