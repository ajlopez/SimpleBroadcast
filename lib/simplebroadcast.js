
var sm = require('simplemessages');

function Broadcaster() {
    var broadcaster = this,
        nclients = 0,
        clients = {},
        server,
        repeater;

    this.newClient = function(client, isrepeater) {
        client.nclient = nclients++;
        client.repeater = isrepeater;
        clients[client.nclient] = client;    

        if (isrepeater) {
          client.on('message', function(msg) { broadcastClients(msg, client); });
        } else {
          client.on('message', function(msg) { broadcaster.broadcast(msg, client); });    
        }

        client.on('end', function() { broadcaster.removeClient(client); });
        client.on('close', function() { broadcaster.removeClient(client); });
    }
    
    this.listen = function(port, host) {
        if (!server)
            server = sm.createServer(function(client) { broadcaster.newClient(client, false); });
            
        server.listen(port, host);
    }
    
    this.listenRepeaters = function(port, host) {
        if (!repeater)
            repeater = sm.createServer(function(client) { broadcaster.newClient(client, true); });
            
        repeater.listen(port, host);
    }
    
    this.close = function() {
        var n;
        for (n in clients)
            clients[n].end();
        if (server)
            server.close();
        if (repeater)
            repeater.close();
    }
    
    this.removeClient = function(client) {
        delete clients[client.nclient];
    }
    
    this.broadcast = function(msg, source) {
        var n;
        try {
            for (n in clients)
                (clients[n] != source) && clients[n].send(msg);
        } 
        catch (ex) {
            console.log(ex.toString());
        }
    }

    function broadcastClients(msg, source) {
        var n;
        try {
            for (n in clients)
                (clients[n] != source) && !clients[n].repeater && clients[n].send(msg);
        } 
        catch (ex) {
            console.log(ex.toString());
        }
    }

    this.connect = function(port, host, isrepeater) {
        var client = sm.createClient();

        isrepeater = isrepeater || false;

        broadcaster.newClient(client, isrepeater);
        client.connect(port, host);
    }
    
    this.connectRepeater = function(port, host) {
        broadcaster.connect(port, host, true);
    }
}

exports.createBroadcaster = function() {
    return new Broadcaster();
}

exports.createClient = function() {
    return sm.createClient();
}

