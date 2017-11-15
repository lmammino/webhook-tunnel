const http = require('http')
const httpProxy = require('http-proxy')

const port = process.argv[2]
const target = process.argv[3]
const proxy = httpProxy.createProxyServer({target})

proxy.on('error', function (err, req, res) {
  console.error(err)
  res.writeHead(502, {'Content-Type': 'text/plain'})
  return res.end('Proxy error')
})

var server = http.createServer(function (req, res) {
  console.log(req.url)
  return proxy.web(req, res, { target: target })
})

console.log('listening on port ' + port)
server.listen(port)
