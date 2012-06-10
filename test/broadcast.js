
var simplebroadcast = require('../'),
    net = require('net');

exports['Broadcast Client to one Client'] = function(test) {
    test.expect(2);
    
    var server = simplebroadcast.createBroadcaster();
    
    server.listen(5000, 'localhost');
    
    var client = simplebroadcast.createClient();
    var client2 = simplebroadcast.createClient();

    client.on('connect', function() {
        client.write({ name: "test" });
    });
    
    client2.on('message', function(msg) {
        test.ok(msg);
        test.equal(msg.name, "test");
        client.end();
        client2.end();
        server.close();
        test.done();
    });
    
    client2.connect(5000, 'localhost');
    client.connect(5000, 'localhost');
}

exports['Broadcast Client to two Clients'] = function(test) {
    test.expect(6);
    
    var server = simplebroadcast.createBroadcaster();
    
    server.listen(5000, 'localhost');
    
    var client = simplebroadcast.createClient();
    var client2 = simplebroadcast.createClient();
    var client3 = simplebroadcast.createClient();

    client.on('connect', function() {
        client.write({ name: "test" });
    });
    
    client2.on('message', function(msg) {
        test.ok(msg);
        test.equal(msg.name, "test");
        client2.write({ name: "test2" });
    });
    
    client3.on('message', function(msg) {
        test.ok(msg);
        
        if (msg.name == "test2") {
            test.equal(msg.name, "test2");
            client.end();
            client2.end();
            client3.end();
            server.close();
            test.done();
        }
        else
            test.equal(msg.name, "test");
    });
    
    client2.connect(5000, 'localhost');
    client3.connect(5000, 'localhost');
    client.connect(5000, 'localhost');
}

