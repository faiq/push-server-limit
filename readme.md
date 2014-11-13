#Express-rate-limit

#Overview

- The middleware is designed to be the easiet possible way to add rate-limiting to your express application.

- It is designed to be an <a href="http://expressjs.com/api.html#middleware.application"> applicationlevel middleware</a>. So do not insert it before routes. 

- It can either be designed to have a limit for all your routes, as demonstrated below
	
	```
	var express = require('express')
	  , rateLimit = require('express-rate-limit')
	  , http = require('http')
	  , app = express()
	  , options = {
	      total_limit: "5000"
	  }
	   
	 app.use(rateLimit(options))
	 ...
	
	```
	
	- or use it to rate limit certain routes 
	
	```
	var express = require('express')
	  , rateLimit = require('faiqsmiddleware')
	  , http = require('http')
	  , app = express()
	
	app.use(rateLimit({
		limit_object: { 
			foo: 500
		}
	}))
	app.get('/foo, function (req, res){ 
		//really heavy calculations you want limited
	})
	
	app.get('/', function(req, res){
		res.send('hi')
	})
	
	```
	
---

#Options

- The middleware is configured through an options object you pass to function.

- The options you pass in are the following

**key** - the way you want to identify each user. You can pass in a string to search for on the `sessions` object. If you're identifying by userId in a database, simply set the key to 'userId', and the module would look for. **key** defaults to IP address. 

**window** - The amount of time you want to enforce your rate limit on for a particular user. **interval** defaults to 3600 seconds (1 hour). 

**total_limit** - the max number of calls sent to your service (including all routes).
 
**limit_objcet** - an object that configures each route to its individual limit. This option should be used if you're using the middleware before all your routes. If you use it in conjunction with the `total_limit` field, the sum of all the routes limits must be less than or equal to `total_limit`

```
	limit_object: { routeName: limit for that route, routeName2: limit} 
	
```

NOTE: `total_limit` or `limit_object` must be present, and **can** be used in conjuction
 
**port** - specify the redis port

