
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//modules needed for http put request
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var sys = require('util');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(3000);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

// set connection socket between server and client.
io.sockets.on('connection', function (socket) {

  // send PUT to hue bridge
  socket.on('hue_para', function (data) {
    setLight(data);
    //respond to the client
    // socket.emit('hue_server_res', { status: 'send command to hue' });
  });

  //get the light state with its ID 
  socket.on('hue_state',function(id, fn){
    console.log(id);
    var options = {
      host: '192.168.1.100',
      port: 80,
      path: '/api/newdeveloper/lights/'+id
    };
    var state;
    http.get(options, function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        state = JSON.parse(body);
        console.log("state");
        console.log(state);
        fn(state);
        // socket.emit('hue_state_res', state);
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  });

});

xhr.onreadystatechange = function() {
  sys.puts("State: " + this.readyState);
  if (this.readyState == 4) {
    sys.puts("Complete.\nBody length: " + this.responseText.length);
    sys.puts("Body:\n" + this.responseText);
  }
};

function setLight(data){
  
  var ip = "http://192.168.1.100";
  var lights = ip + "/api/newdeveloper/lights/"+data["light_idx"]+"/state";
  // data["on"]=true;
  var message = data;
  delete message.light_idx;
  console.log("lights ip is:");
  console.log(lights);
  console.log("message is:");
  console.log(message);
  xhr.open("PUT",lights,true);
  xhr.send(JSON.stringify(message));
}



