
var sm = require('simplemessages');

function Broadcaster()
{
    var broadcaster = this;
    
    var nclients = 0;
    var clients = {};
    var server;

    var nrepeaters = 0;
    var repeaters = {};
    var repeater;
    
    this.newClient = function(client) {
        clientOn(client);
        client.nclient = nclients++;
        clients[client.nclient] = client;
    }
    
    this.newRepeater = function(repeater) {
        repeaterOn(repeater);
        repeater.nrepeater = nrepeaters++;
        repeaters[repeater.nrepeater] = repeater;
    }
    
    this.listen = function(port, host) {
        if (!server)
            server = sm.createServer(function(client) { broadcaster.newClient(client); });
            
        server.listen(port, host);
    }
    
    this.listenRepeaters = function(port, host) {
        if (!repeater)
            repeater = sm.createServer(function(client) { broadcaster.newRepeater(client); });
            
        repeater.listen(port, host);
    }
    
    this.close = function() {
        for (var n in clients)
            clients[n].end();
        for (var n in repeaters)
            repeaters[n].end();
        
        if (server)
            server.close();
            
        if (repeater)
            repeater.close();
    }
    
    this.removeClient = function(client) {
        delete clients[client.nclient];
    }
    
    this.removeRepeater = function(repeater) {
        delete repeaters[repeater.nrepeater];
    }
    
    this.broadcast = function(msg, source, isrepeater) {
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
        
        if (isrepeater)
            return;
            
        for (var n in repeaters)
        {
            var repeater = repeaters[n];

            if (repeater == source)
                continue;

            try {
                repeater.write(msg);
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
    
    this.connectRepeater = function(port, host) {
        var client = sm.createClient();

        client.on('connect', function() {
            client.nrepeater = nrepeaters++;
            repeaters[client.nrepeater] = client;
        });
        
        repeaterOn(client);

        client.connect(port, host);
    }
    
    function clientOn(client) {
        client.on('message', function(msg) { broadcaster.broadcast(msg, client); });
        client.on('end', function() { broadcaster.removeClient(client); });
        client.on('close', function() { broadcaster.removeClient(client); });
    }
    
    function repeaterOn(repeater) {
        repeater.on('message', function(msg) { broadcaster.broadcast(msg, repeater, true); });
        repeater.on('end', function() { broadcaster.removeRepeater(repeater); });
        repeater.on('close', function() { broadcaster.removeRepeater(repeater); });
    }
}

exports.createBroadcaster = function() {
    return new Broadcaster();
}

exports.createClient = function() {
    return sm.createClient();
}

