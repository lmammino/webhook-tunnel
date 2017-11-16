const { parse } = require('url')
const Netmask = require('netmask').Netmask

const isInCidr = (remoteAddress) => (cidr) => {
  const range = new Netmask(cidr)
  return range.contains(remoteAddress)
}

const isInPath = (url) => (path) => {
  return url.indexOf(path) === 0
}

const hasKeyValue = (obj) => (expr) => {
  const [key, value] = expr.split('=')
  return (String(obj[key]) === String(value))
}

module.exports = (req, options) => {
  const { path, query } = parse(req.url, true)

  if (options.expectCidr) {
    if (!options.expectCidr.some(isInCidr(req.connection.remoteAddress))) {
      throw new Error(`Request rejected, remote address "${req.connection.remoteAddress}" not in expected CIDRs list`)
    }
  }

  if (options.expectPath) {
    if (!options.expectPath.some(isInPath(path))) {
      throw new Error(`Request rejected, request path "${path}" not in expected paths list`)
    }
  }

  if (options.expectQuery) {
    if (!options.expectQuery.some(hasKeyValue(query))) {
      throw new Error(`Request rejected, request query ${JSON.stringify(query)} is not matching expected query patameters`)
    }
  }

  if (options.expectHeader) {
    if (!options.expectHeader.some(hasKeyValue(req.headers))) {
      throw new Error(`Request rejected, request headers ${JSON.stringify(req.headers)} are not matching expected headers`)
    }
  }

  if (options.expectMethod) {
    if (!options.expectMethod.includes(req.method)) {
      throw new Error(`Request rejected, request method "${req.method}" is not supported`)
    }
  }
}
