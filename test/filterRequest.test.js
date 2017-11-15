const filterRequest = require('../src/filterRequest')

// CIDR

test('It should reject requests with invalid CIDR', () => {
  const mockReq = {
    url: '/someurl',
    connection: {
      remoteAddress: '127.0.0.0'
    }
  }

  const options = {
    expectCidr: ['22.22.22.22/24']
  }

  expect(() => filterRequest(mockReq, options)).toThrow()
})

test('It should accept requests with valid CIDR', () => {
  const mockReq = {
    url: '/someurl',
    connection: {
      remoteAddress: '127.0.0.0'
    }
  }

  const options = {
    expectCidr: ['22.22.22.22/24', '127.0.0.0/24']
  }

  expect(() => filterRequest(mockReq, options)).not.toThrow()
})

// path

test('It should reject requests with invalid path', () => {
  const mockReq = {
    url: '/someurl?somequery=1'
  }

  const options = {
    expectPath: ['/foo']
  }

  expect(() => filterRequest(mockReq, options)).toThrow()
})

test('It should accept requests with valid path', () => {
  const mockReq = {
    url: '/foo?somequery=1'
  }

  const options = {
    expectPath: ['/bar', '/foo']
  }

  expect(() => filterRequest(mockReq, options)).not.toThrow()
})

// query

test('It should reject requests with invalid query', () => {
  const mockReq = {
    url: '/someurl?somequery=1'
  }

  const options = {
    expectQuery: ['somequery=2']
  }

  expect(() => filterRequest(mockReq, options)).toThrow()
})

test('It should accept requests with valid query', () => {
  const mockReq = {
    url: '/someurl?somequery=17'
  }

  const options = {
    expectQuery: ['somequery=2', 'somequery=17']
  }

  expect(() => filterRequest(mockReq, options)).not.toThrow()
})

// header

test('It should reject requests with invalid headers', () => {
  const mockReq = {
    url: '/someurl',
    headers: {
      'x-api-key': '123456'
    }
  }

  const options = {
    expectHeader: ['x-api-key=foo']
  }

  expect(() => filterRequest(mockReq, options)).toThrow()
})

test('It should accept requests with valid headers', () => {
  const mockReq = {
    url: '/someurl',
    headers: {
      'x-api-key': '123456'
    }
  }

  const options = {
    expectHeader: ['x-api-key=foo', 'x-api-key=123456']
  }

  expect(() => filterRequest(mockReq, options)).not.toThrow()
})

// method

test('It should reject requests with invalid method', () => {
  const mockReq = {
    url: '/someurl',
    method: 'post'
  }

  const options = {
    expectMethod: ['get']
  }

  expect(() => filterRequest(mockReq, options)).toThrow()
})

test('It should accept requests with valid method', () => {
  const mockReq = {
    url: '/someurl',
    method: 'post'
  }

  const options = {
    expectMethod: ['get', 'post']
  }

  expect(() => filterRequest(mockReq, options)).not.toThrow()
})
