
var simplebroadcast = require('../'),
    net = require('net');

exports['Broadcast Client to two Clients using two Repeaters'] = function(test) {
    test.expect(6);
    
    var server = simplebroadcast.createBroadcaster();
    server.listen(5000, 'localhost');
    var server2 = simplebroadcast.createBroadcaster();
    server2.listen(5001, 'localhost');
    server2.listenRepeaters(5003, 'localhost');
    
    server.connectRepeater(5003, 'localhost');
    
    var clients = setupThreeClients(test, [server, server2], 5001, 'localhost');
}

exports['Broadcast Client to two Clients using two Repeaters (Inverse)'] = function(test) {
    test.expect(6);
    
    var server = simplebroadcast.createBroadcaster();
    server.listen(5000, 'localhost');
    var server2 = simplebroadcast.createBroadcaster();
    server2.listen(5001, 'localhost');
    server2.listenRepeaters(5003, 'localhost');
    
    server.connectRepeater(5003, 'localhost');
    
    var clients = setupThreeClients(test, [server, server2], 5001, 'localhost');
}

function setupThreeClients(test, servers, port, host)
{
    var socket = net.connect(port, host);
    var client = simplebroadcast.createClient(socket);
    var socket2 = net.connect(port, host);
    var client2 = simplebroadcast.createClient(socket2);
    var socket3 = net.connect(port, host);
    var client3 = simplebroadcast.createClient(socket3);

    var connected = 0;

    function connect() {
        connected++;

        if (connected === 3)
            client.write({ name: 'test' });
    }

    socket.on('connect', connect);
    socket2.on('connect', connect);
    socket3.on('connect', connect);
    
    client2.on('data', function(msg) {
        test.ok(msg);
        test.equal(msg.name, "test");
        client2.write({ name: "test2" });
    });
    
    client3.on('data', function(msg) {
        test.ok(msg);
        
        if (msg.name == "test2") {
            test.equal(msg.name, "test2");
            client.end();
            client2.end();
            client3.end();
            servers.forEach(function(server) { server.close(); });
            test.done();
        }
        else
            test.equal(msg.name, "test");
    });
    
    return [client, client2, client3];
}
