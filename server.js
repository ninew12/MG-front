var express = require('express')
var app = express();
var http = require('http');
var https = require('https');
var serveStatic = require('serve-static');
var join = require('path').join;
var fs = require('fs');

const processEnv = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

const env = {
    development: {port: 80, protocol: 'http'},
    staging: {port: 80, protocol: 'http'},
    production: {port: 443, protocol: 'https'},
}

function ensureSecure(req, res, next) {
    if (req.secure) {
        // OK, continue
        return next();
    }
    ;
    res.redirect('https://' + req.hostname + req.url); // express 4.x
}

if (env[processEnv].protocol == 'https') {
    app.all('*', ensureSecure);
}
app.use(express.static('./'));
// app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}));

// var port = (process.env.WEB_PORT) ? process.env.WEB_PORT : 80;
var port = env[processEnv].port;

if (env[processEnv].protocol == 'https') {
    let options = {
        key: fs.readFileSync(join(__dirname, './cert/senseino.co.key')),
        cert: fs.readFileSync(join(__dirname, './cert/senseino.co.crt')),
        ca: fs.readFileSync(join(__dirname, './cert/senseino.co.ca'))
    };

    var server = https.createServer(options, app);
    server.listen(port, function () {
    });
}

var httpsServer = http.createServer(app);
httpsServer.listen(80, function () {
});

