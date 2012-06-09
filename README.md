# SimpleBroadcast

Simple broadcasting and repeating of JSON messages using net sockets.

## Installation

Via npm on Node:

```
npm install simplebroadcast
```

Reference it from your program:

```js
var simplebroadcast = require('simplebroadcast');
```

## Usage

Server side

```js
var server = simplebroadcast.createBroadcaster();

server.listen(8000);
```

Sending a message (any Javascript value that can be processed by JSON.stringify

```js
server.write(msg);
```

Client side

```js
var client = simplebroadcast.createClient();

client.on('message', function(message) {
	// message processing
});

client.connect(port, host);

// broadcasting a message
client.write(msg);

```

## Development

```
git clone git://github.com/ajlopez/SimpleBroadcast.git
cd SimpleBroadcast
npm install
npm test
```

## Samples

TBD

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleBroadcast) and submit
[pull requests](https://github.com/ajlopez/SimpleBroadcast/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5) by [aseemk](https://github.com/aseemk). 
This file is based on that project README.md).

