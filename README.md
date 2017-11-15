# webhook-tunnel


[![npm version](https://badge.fury.io/js/webhook-tunnel.svg)](http://badge.fury.io/js/webhook-tunnel)
[![CircleCI](https://circleci.com/gh/lmammino/webhook-tunnel.svg?style=shield)](https://circleci.com/gh/lmammino/webhook-tunnel)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/lmammino/webhook-tunnel/badge.svg)](https://snyk.io/test/github/lmammino/webhook-tunnel)

A little http proxy suitable to create tunnel for web hooks endpoint living behind a firewall or a VPN


## Rationale

If you are doing security properly in your company it's very likely that most of your resources will be
protected behind a firewall or a VPN, including things like Continuous Integration pipelines (e.g. Jenkins)
or other web based tools.

In such scenarios it becomes tricky to integrate external services (e.g. GitHub) with your internal tools
through web hooks.

For example it becomes hard to allow GitHub to notify your secured CI instance that there's a new commit
on one of the projects your CI is building.

This tool allows you to create a tunnel that can be used for routing web hooks requests through your
security layer.

This approach, of course, creates a connection channel from the outside to your internal infrastructure,
so be sure to limit the access to the tunnel as much as you can.


## Install

From npm:

```bash
npm install --global webhook-tunnel
```

(this requires [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/) version >= 8)


Or you can simply download one of the binaries available in the [Releases](https://github.com/lmammino/webhook-tunnel/releases) section.

Note: the compiled executable contains a full-blown version of the Node.js runtime
embedded in it. So use this version only if you want to run the tunnel in an environment that
does not have a supported version of Node.js already installed.


## Execute

To execute the proxy in your server:

```bash
webhook-tunnel <target>
```

Where `target` is the full URL where every request will be proxied to.

E.g.

```bash
webhook-tunnel http://myprivatejenkins.tld/somepath/
```

By default the server will be bound to `0.0.0.0:12345`.


### Command line options

This is the full list of supported command line options:

```plain
Options:
  --help               Show help                                       [boolean]
  --bind-address, -a   The bind address of the server
                                                   [string] [default: "0.0.0.0"]
  --port, -p           The port on which the server will be listening to
                                                       [number] [default: 12345]
  --expect-cidr, -C    Rejects the request if it is not coming from one of the
                       specified IP ranges (CIDRs)                       [array]
  --expect-path, -P    Rejects the request if it is not addressed to one of the
                       specified path prefixes                           [array]
  --expect-query, -Q   Rejects the request if it doesn't contain any of
                       specified query parameters with a matching value (e.g.
                       token=1234)                                       [array]
  --expect-header, -H  Rejects the request if it doesn't contain any of
                       specified headers with a matching value (e.g.
                       x-token=1234)                                     [array]
  --expect-method, -M  Rejects the request if it is not using one of the
                       specified methods (e.g. `GET`)                    [array]
  --log-level, -l      Logging level (one of 'fatal', 'error', 'warn', 'info',
                       'debug', 'trace' or 'silent')  [string] [default: "info"]
  --version            Show version number                             [boolean]
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/webhook-tunnel/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
