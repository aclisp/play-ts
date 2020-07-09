"use strict";
exports.__esModule = true;
var events_1 = require("events");
var fs = require("fs");
var express = require("express");
var chatEmitter = new events_1.EventEmitter();
var port = process.env.PORT || 1337;
var app = express();
app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/static/*', respondStatic);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.listen(port, function () { return console.log("Server listening on port " + port); });
function respondText(req, res) {
    res.setHeader('Context-Type', 'text/plain');
    res.end('hi');
}
function respondJson(req, res) {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
}
function respondEcho(req, res) {
    var _a = req.query.input, input = _a === void 0 ? '' : _a;
    var inputAsString = input;
    res.json({
        normal: inputAsString,
        shouty: inputAsString.toUpperCase(),
        characterCount: inputAsString.length,
        backwards: inputAsString
            .split('')
            .reverse()
            .join('')
    });
}
function respondStatic(req, res) {
    var filename = __dirname + "/public/" + req.params[0];
    fs.createReadStream(filename)
        .on('error', function () { return respondNotFound(req, res); })
        .pipe(res);
}
function respondChat(req, res) {
    var message = req.query.message;
    chatEmitter.emit('message', message);
    res.end();
}
function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive'
    });
    var onMessage = function (msg) { return res.write("data: " + msg + "\n\n"); };
    chatEmitter.on('message', onMessage);
    res.on('close', function () {
        chatEmitter.off('message', onMessage);
    });
}
function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}
//# sourceMappingURL=chat_server.js.map