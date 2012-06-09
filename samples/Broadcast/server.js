
var simplebroadcast = require('../../'),
    sargs = require('simpleargs');


var server = simplebroadcast.createBroadcaster(function(client) { broadcaster.newClient(client); });

sargs.define('p', 'port', 3000, 'Port to listen');
var options = sargs.process(process.argv);
    
server.listen(options.port);

