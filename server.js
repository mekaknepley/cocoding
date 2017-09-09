var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");

var r= require("rethinkdb");

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var passport = require('passport');

var port = process.env.PORT || 3000;

require('./config/passport')(passport);

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

io.on('connection', function(socket) {
    console.log('user connected to chat');
    socket.on('disconnect', function(){
        console.log('user disconnected from chat');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

// required for passport
app.use(session({
    secret: 'coCodersSecret',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Import routes and give the server access to them.
var routes = require("./controllers/controller.js")(passport);

app.use("/", routes);

//app.listen(port);
// socket.io needs to use http directly
http.listen(port);