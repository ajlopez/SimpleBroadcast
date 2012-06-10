
var sm = require('simplemessages');

function Broadcaster()
{
    var nclients = 0;
    var clients = {};
    var broadcaster = this;
    var server = sm.createServer(function(client) { broadcaster.newClient(client); });
    
    this.newClient = function(client) {
        clientOn(client);
        client.nclient = nclients++;
        clients[client.nclient] = client;
    }
    
    this.listen = function(port, host) {
        server.listen(port, host);
    }
    
    this.close = function() {
        for (var n in clients)
            clients[n].end();
            
        server.close();
    }
    
    this.removeClient = function(client) {
        delete clients[client.nclient];
    }
    
    this.broadcast = function(source, msg) {
        for (var n in clients)
        {
            var client = clients[n];

            if (client == source)
                continue;

            try {
                client.write(msg);
            }
            catch (ex) {
                console.log(ex.toString());
            }
        }
    }
    
    this.connect = function(port, host) {
        var client = sm.createClient();

        client.on('connect', function() {
            client.nclient = nclients++;
            clients[client.nclient] = client;
        });
        
        clientOn(client);

        client.connect(port, host);
    }
    
    function clientOn(client) {
        client.on('message', function(msg) { broadcaster.broadcast(client, msg); });
        client.on('end', function() { broadcaster.removeClient(client); });
        client.on('close', function() { broadcaster.removeClient(client); });
    }
}

exports.createBroadcaster = function() {
    return new Broadcaster();
}

exports.createClient = function() {
    return sm.createClient();
}

