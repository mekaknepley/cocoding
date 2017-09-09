var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");

var r = require('rethinkdb');

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
/*var passport = require("passport");*/

var port = process.env.PORT || 3000;

/*require('./config/passport')(passport);*/

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//rethinkdb connection
r.connect({host: 'localhost', port: 28015}, function(err, conn){
    if(err) throw err;
    r.db('test').tableList().run(conn, function(err, res){
       if(res.indexOf('edit') > -1){
           //do nothing it is created...
           console.log('Table exists, skipping create...');
           console.log('Tables - ' + res);
       } else {
           //create table
           console.log('Table does not exists. Creating');
           r.db('test').tableCreate('edit').run(conn);
       }
    });
    
    //Socket setup
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
           console.log('user disconnected'); 
        });
        socket.on('document-update', function(msg){
            console.log(msg);
            r.table('edit').insert({id: msg.id, value: msg.value, user: msg.user}, {conflict: "update"}).run(conn, function(err, res){
                if(err) throw err;
                //console.log(JSON.stringify(res, null, 2));
            });
        });
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });
        
        r.table('edit').changes().run(conn, function(err, cursor){
           if(err) throw err;
            cursor.each(function(err, row){
               if(err) throw err;
                io.emit('doc', row);
            });
        });
    });
    
    app.get('/getData/:id', function(req, res, next){
       r.table('edit').get(req.params.id).run(conn, function(err, result){
           if(err) throw err;
           res.send(result);
           //return next(result);
       }); 
    });
});


/*--------------------------------------------------------------*/

// required for passport
/*
app.use(session({
    secret: 'coCodersSecret',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
*/


// Import routes and give the server access to them.
var routes = require("./controllers/controller.js");

app.use("/", routes);


// socket.io needs to use http directly
http.listen(port);