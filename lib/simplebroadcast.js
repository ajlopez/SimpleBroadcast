
var sm = require('simplemessages');

function Broadcaster()
{
    var nclients = 0;
    var clients = {};
    var broadcaster = this;
    var server = sm.createServer(function(client) { broadcaster.newClient(client); });
    
    this.newClient = function(client) {
        client.nclient = nclients++;
        clients[client.nclient] = client;
        client.on('message', function(msg) { broadcaster.broadcast(client, msg); });
        client.on('end', function() { broadcaster.removeClient(client); });
        client.on('close', function() { broadcaster.removeClient(client); });
    }
    
    this.listen = function(port, host) {
        server.listen(port, host);
    }
    
    this.close = function() {
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
}

exports.createBroadcaster = function() {
    return new Broadcaster();
}

exports.createClient = function() {
    return sm.createClient();
}

