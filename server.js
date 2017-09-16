var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");
var r= require("rethinkdb");
var passport = require("passport");

var OpenTok = require('opentok');
// API keys from mekaknepley account
var opentok = new OpenTok("45957952", "4f5470f1e4adee3f3b9e87cd7232505b47904893");

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

require('./config/passport')(passport);

var port = process.env.PORT || 3000;

// DEBUG Create a global opentok session and store it in the express app
// When rooms are stored in the database, the session id will get stored there
opentok.createSession(function(err, session) {
    if (err) throw err;
    app.set('sessionId', session.sessionId);
    //console.log(session.sessionId);
});

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Socket setup
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
       console.log('user disconnected'); 
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
var routes = require("./controllers/controller.js")(app, passport, opentok);

app.use("/", routes);

//app.listen(port);
// socket.io needs to use http directly
http.listen(port);