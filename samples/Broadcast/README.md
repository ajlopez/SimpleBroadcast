# Broadcast Sample

A broadcast sample, one server, many clients. Each client repeats a message.

## Usage

### Server
```
node server.js
```
It listens to port 3000.

Options
```
-p, --port    Port
```

Example
```
node server.js -p 4000
```

### Clients
```
node client.js [message]
```
If no arguments, the message is a `Hello, world`. It connects to localhost, port 3000.

Options
```
-p, --port      Server Port, default 3000
-h, --host      Server Host, default localhost
-t, --timeout   Timeout (in milliseconds) to repeat the message, default 1000
```

Examples
```
node client.js hi
node client.js hi -p 4000 -h myhost -t 100
```

