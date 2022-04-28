const http = require('http');
const port = process.env.PORT || 3000;

var uptime = 0;

setInterval(function(){
    uptime++;
}, 1000);

function server(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n' + uptime + '\n' + new Date());
}

http.createServer(server).listen(port);