# SimpleBroadcast

Simple broadcasting of JSON messages using net sockets.

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

Broadcaster (server) side
```js
var broadcaster = simplebroadcast.createBroadcaster();

broadcaster.listen(8000);
```

Client side
```js
var client = simplebroadcast.createClient();

client.on('message', function(message) {
    // message processing
});

client.connect(port, host);

// broadcasting a message, after connection
client.on('connect', function() {
    client.write(msg);
}

```

A broadcaster can connect to another broadcaster. Each one is the cliente of the other.
```js
broadcaster.connect(port, host));
```
You can build a tree of broacasters. A tree is a graph without cycles. If the graph of broadcasters has a cycle, you messages will be send forever.

A broadcaster can act as a repeater, listening to other repeateres, or connecting as a repeater to another one.
```js
broadcaster.listenRepeater(8001);
broadcaster.connectRepeater(8002, 'repeater2');
```
The messages sent by a repeater are broadcasted to all clients, but not to other repeaters. The messages sent by a client are broadcaster to the others clients and to all 
repeaters. In this way, you can  build a graph of repeaters, including cycles. Usually it is an star graph were all repeaters are connectened to the others.

## Development

```
git clone git://github.com/ajlopez/SimpleBroadcast.git
cd SimpleBroadcast
npm install
npm test
```

## Samples

[Broadcast messages to many clients](https://github.com/ajlopez/SimpleBroadcast/tree/master/samples/Broadcast) sample shows
how you send and receive messages to/from many clients thru a broadcast server.

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleBroadcast) and submit
[pull requests](https://github.com/ajlopez/SimpleBroadcast/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5) by [aseemk](https://github.com/aseemk). 
This file is based on that project README.md).

