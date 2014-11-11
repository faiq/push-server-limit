var express = require('express')
  , http = require('http')
  , app = express() 
  , server = http.createServer(app)

app.use(function(req, res, next) {
  console.log(req.originalUrl)
})
app.use(function (req, res, next) { 
  next(new Error('some redis shit')) 
})

app.get('/', function (req, res) { 
  res.send('heres a response') 
})

app.use(function (e, req, res, n){ 
  console.log(e + ' error was thrown') 
})

server.listen(3000)
