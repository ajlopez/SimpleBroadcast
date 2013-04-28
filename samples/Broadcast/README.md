# Broadcast Sample

A broadcast sample, one server, many clients. Each client repeats a message.

## Usage

### Server
```
node server.js
```
It listens to port 3000.

Options:
- `-p <port>`, `--port <port>`: Port to listen. Default value: 3000

Example
```
node server.js -p 4000
```

### Clients
```
node client.js [message]
```
If no arguments, the message is a `Hello, world`. It connects to localhost, port 3000.

Options:
- `-h <host>`, `--host <host>`: Server host. Default value: localhost
- `-p <port>`, `--port <port>`: Server port. Default value: 3000
- `-t <timeout>`, `--timeout <timeout>`: Timeout between message, in milliseconds. Default value: 1000

Examples:
```
node client hi
node client -p 3000 -h localhost hi
node client --timeout 2000 hi
```

