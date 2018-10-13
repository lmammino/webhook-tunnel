#!/usr/bin/env node

const http = require('http')
const httpProxy = require('http-proxy')
const pino = require('pino')
const yargs = require('yargs')
const filterRequest = require('./filterRequest')

const argv = yargs
  .usage('$0 <target>', 'Run the tunnel server', yargs => {
    yargs.positional('target', {
      describe: 'The URL to which proxy the requests to',
      type: 'string'
    })
  })
  .option('bind-address', {
    alias: 'a',
    describe: 'The bind address of the server',
    type: 'string',
    default: '0.0.0.0'
  })
  .option('port', {
    alias: 'p',
    describe: 'The port on which the server will be listening to',
    type: 'number',
    default: 12345
  })
  .option('health', {
    alias: 'h',
    describe: 'Listen for the path /health in the request to use as a health check',
    type: 'boolean',
    default: false
  })
  .option('expect-cidr', {
    alias: 'C',
    describe:
      'Rejects the request if it is not coming from one of the specified IP ranges (CIDRs)',
    type: 'array'
  })
  .option('expect-path', {
    alias: 'P',
    describe:
      'Rejects the request if it is not addressed to one of the specified path prefixes',
    type: 'array'
  })
  .option('expect-query', {
    alias: 'Q',
    describe:
      "Rejects the request if it doesn't contain any of specified query parameters with a matching value (e.g. token=1234)",
    type: 'array'
  })
  .option('expect-header', {
    alias: 'H',
    describe:
      "Rejects the request if it doesn't contain any of specified headers with a matching value (e.g. x-token=1234)",
    type: 'array'
  })
  .option('expect-method', {
    alias: 'M',
    describe:
      'Rejects the request if it is not using one of the specified methods (e.g. `GET`)',
    type: 'array'
  })
  .option('log-level', {
    alias: 'l',
    describe:
      "Logging level (one of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent')",
    type: 'string',
    default: 'info'
  })
  .version().argv

// initializes logger
const logger = pino({
  name: 'webhook-tunnel',
  safe: true,
  level: argv.logLevel,
  prettyPrint: { colorize: true }
})

logger.debug(
  {
    runtime: process.argv[0],
    script: process.argv[1],
    arguments: argv
  },
  'Initializing'
)

const proxy = httpProxy.createProxyServer({ target: argv.target })

proxy.on('error', function (err, req, res) {
  logger.error(err)
  res.writeHead(502, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ error: 'Proxy error' }))
})

var server = http.createServer(function (req, res) {
  logger.info(`Incoming request: ${req.method} ${req.url}`)
  logger.debug(req)
  try {
    if (argv.health && req.url.match(/health$/)) {
      return res.end(JSON.stringify({ status: 'ok' }))
    }
    filterRequest(req, argv)
    return proxy.web(req, res, { target: argv.target })
  } catch (err) {
    logger.error(err, 'Request rejected')
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Request rejected' }))
  }
})

server.listen(argv.port, argv.bindAddress, err => {
  if (err) {
    throw err
  }

  logger.info(
    {
      address: argv.bindAddress,
      port: argv.port
    },
    'Server started'
  )
})
