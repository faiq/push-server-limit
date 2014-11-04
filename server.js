var express = require('express')
  , http = require('http')
  , rateLimit = require('./index') 
  , app = express() 
  , server = http.createServer(app)

app.use(rateLimit()) 
app.get('/', function (req, res) { 
  res.send('heres a response') 
})
server.listen(3000)
