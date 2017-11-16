# webhook-tunnel


[![npm version](https://badge.fury.io/js/webhook-tunnel.svg)](http://badge.fury.io/js/webhook-tunnel)
[![CircleCI](https://circleci.com/gh/lmammino/webhook-tunnel.svg?style=shield)](https://circleci.com/gh/lmammino/webhook-tunnel)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/lmammino/webhook-tunnel/badge.svg)](https://snyk.io/test/github/lmammino/webhook-tunnel)

A little HTTP proxy suitable to create tunnels for webhook endpoints protected behind a firewall or a VPN


## Rationale

If you are doing security properly in your company, it's very likely that most of your resources will be
protected behind a firewall or a VPN, including things like Continuous Integration pipelines (e.g. Jenkins)
or other tools with web based integrations.

In such scenarios, it becomes tricky to integrate external services (e.g. GitHub) with your internal tools
through web hooks.

For example, it becomes hard to allow GitHub to notify your secured CI instance that there's a new push
on one of the projects that your CI is building.

Webhook-tunnel allows you to create an HTTP tunnel that can be used for routing web hooks requests through your security layers.

This approach creates a connection channel from the outside to your internal infrastructure,
so be sure to limit the access to the tunnel as much as you can.

To increase the security level of the tunnel, Webhook-tunnel can be configured to apply a number of diffent
filters over the HTTP requests and block them from getting into the internal network. Consult the section [filters](#filters) to know more about this aspect.

Here's an example configuration that demonstrates how the tunnel can be used:

![Example CI diagram](/images/ci-example.png)


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


## Filters

Webhook-tunnel supports a number of filters straight away.
The currently supported filters are:

  - [Ip ranges (CIDR)](#ip-ranges)
  - [Request Path prefixes](#request-path)
  - [Query string parameters](#query-string)
  - [Header parameters](#header)
  - [HTTP methods](#method)

By default every filter is disabled, so every request can cross the tunnel.
For every filter you can specify one or more rules. As soon as you have a rule for a filter,
No request can pass the tunnel unless the request matches the rule.

We can recap the internal flow with the following statements:

  1. if no filter is used (no rules in every filter), every request can cross the tunnel
  2. if you have a rule under a filter, every request is blacklisted, unless it matches the rule
  3. if you have a filter with more than one rule, then at least one rule per every filter should be matched to allow the request to cross the tunnel.


### IP Ranges

If you want to accept requests that come only from a selected list of IPs you can run
the tunnel with the option `--expect-cidr`. This option allows you to add a rule under the CIDR filter.
You can create multiple rules by using the option multiple times.

Example:

```bash
webhook-tunnel http://somedonain.tld --expect-cidr 22.23.24.25/22 --expect-cidr 120.25.25.25/22
```

This way the tunnel will accept **only** requests coming from `22.23.24.25/22` **or** `120.25.25.25/22`.


### Request path

You can restrict the requests being tunneled by **path prefix** with the option `--expect-path`.
By default all the paths are accepted but you can add one or more path rules as in the following example:

```bash
webhook-tunnel http://somedonain.tld --expect-path /path1 --expect-path /path2
```

With this configuration requests with a prefix path of `/path1` and `/path2` (e.g. `/path1/producs` or `/path123`) will be allowed, while all the other requests will be rejected.


### Query string

You can restrict the requests being tunneled by **query parameters** with the option `--expect-query`.
This option accepts arguments in the form `key=value`. You can specify multiple `--expect-query` options and the request will be tunneled only if at least one of the rules is matched.

E.g.

```bash
webhook-tunnel http://somedonain.tld --expect-query token=xyz --expect-query auth=admin
```

With this configuration requests with a query string like `?token=xyz` **or** `?auth=admin` will be allowed, while all the other requests will be rejected.


### Header

Headers filters behave exactly like query string, except that headers are used for the match.
To specify headers rules you have to use the `--expect-header` option.


### Method

You can restrict the requests by HTTP method (`get`, `post`, `patch`, etc.).

To set the method rules you have to use the `--expect-method` option. You can specify the option
multiple times and the request will be tunneled only if at least one of the rules is matched.

E.g.

```bash
webhook-tunnel http://somedonain.tld --expect-method get --expect-method post
```

Will accept only `post` **or** `get` requests.


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/webhook-tunnel/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
