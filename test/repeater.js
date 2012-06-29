
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
    
    var clients = setupThreeClients(test, [server, server2]);
        
    clients[1].connect(5001, 'localhost');
    clients[2].connect(5001, 'localhost');
    clients[0].connect(5000, 'localhost');
}

exports['Broadcast Client to two Clients using two Repeaters (Inverse)'] = function(test) {
    test.expect(6);
    
    var server = simplebroadcast.createBroadcaster();
    server.listen(5000, 'localhost');
    var server2 = simplebroadcast.createBroadcaster();
    server2.listen(5001, 'localhost');
    server2.listenRepeaters(5003, 'localhost');
    
    server.connectRepeater(5003, 'localhost');
    
    var clients = setupThreeClients(test, [server, server2]);
        
    clients[1].connect(5001, 'localhost');
    clients[2].connect(5000, 'localhost');
    clients[0].connect(5001, 'localhost');
}

function setupThreeClients(test, servers)
{
    var client = simplebroadcast.createClient();
    var client2 = simplebroadcast.createClient();
    var client3 = simplebroadcast.createClient();

    client.on('connect', function() {
        client.send({ name: "test" });
    });
    
    client2.on('message', function(msg) {
        test.ok(msg);
        test.equal(msg.name, "test");
        client2.send({ name: "test2" });
    });
    
    client3.on('message', function(msg) {
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