const {app, BrowserWindow} = require('electron')
const PORT = 8888
// electron main
console.log(process.versions);

app.on("ready", function () {
    var ipc = require('electron').ipcMain
    ipc.on("console", function (ev) {
        var args = [].slice.call(arguments, 1);
        var r = console.log.apply(console, args);
        ev.returnValue = [r];
    });
    ipc.on("app", function (ev, msg) {
        var args = [].slice.call(arguments, 2);
        ev.returnValue = [app[msg].apply(app, args)];
    });

    var window = new BrowserWindow({show: false});
    window.loadURL("F://Программирование/python my projects/testforarmojs/app.html");
    window.webContents.once("did-finish-load", function () {
        var http = require("http");
        var crypto = require("crypto");
        var server = http.createServer(function (req, res) {
            var port = crypto.randomBytes(16).toString("hex");
            ipc.once(port, function (ev, status, head, body) {
                res.writeHead(status, head);
                res.end(body);
            });
            window.webContents.send("request", req, port);
        });
        server.listen(8888);
        console.log("http://localhost:8888/");
    });
});