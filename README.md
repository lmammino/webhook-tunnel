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
webhook-tunnel <port> <target>
```

Where `port` is the port on which the proxy will be listening to and `target` is the
full URL where every request will be proxied to.

E.g.

```bash
webhook-tunnel 12345 http://myprivatejenkins.tld/somepath/
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/webhook-tunnel/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
