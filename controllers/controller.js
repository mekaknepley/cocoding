module.exports = function(app, passport, opentok) {
    var express = require("express");

    var router = express.Router();

    var mysql = require('mysql');
    var dbconfig = require('../config/database');
    var connection;
    var firebase = require('firebase');

    /******************* FIREBASE *******************/
    var config = {
        apiKey: "AIzaSyClQP9Fg9deVgrwupRCCxbcClvLFMR0AnQ",
        authDomain: "realtime-e3651.firebaseapp.com",
        databaseURL: "https://realtime-e3651.firebaseio.com",
        projectId: "realtime-e3651",
        storageBucket: "realtime-e3651.appspot.com",
        messagingSenderId: "67777252179"
    };
    firebase.initializeApp(config);

    var db = firebase.database();
    var roomsdb = db.ref().child('rooms');
    /******************* ******** *******************/

    if (process.env.JAWSDB_MARIA_URL) {
        console.log("Using" + process.env.JAWSDB_MARIA_URL);
        connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
    } else {
        connection = mysql.createConnection(dbconfig.localdbconnection);
    }

    connection.connect(function(err) {
        if (err) {
            console.error("error connection: " + err.stack);
        } else {
            console.log("router connected to db");
        }
    });

// Export routes for server.js to use.
    module.exports = router;

// Create all our routes and set up logic within those routes where required.
    router.get("/", function (req, res) {
        if (req.isAuthenticated())
        {
            res.redirect("/room");7
        } else {
            res.render("landingpage");
        }
    });

    router.get('/terminal/:roomId', isLoggedIn, function (req, res) {
        var room = req.params.roomId;
        console.log("rendering terminal for " + req.params.roomId);

        var roomQuery = "SELECT * FROM " + dbconfig.rooms_table + " WHERE id = (?)";
        connection.query(roomQuery, [req.params.roomId], function(err, rows) {

            if (err) throw err;

            console.log("found rooms " + rows.length + " for id " + req.params.roomId);

            // generate a fresh token for this client
            var token = opentok.generateToken(rows[0].sessionId);

            res.render("terminal", {
                username: req.user.username,
                id: req.params.roomId,
                apiKey: "45957952",
                sessionId: rows[0].sessionId,
                token: token});
        });
        //res.render("terminal", { username: req.user.username });
        /********** FIREBASE *********/
        /*roomsdb.update({[room]:'<h1>Hello World!</h1>'});*/
        /*var editor = document.getElementById('editor-value').val();
         function write(){
            var data = editor;
            console.log(data);
            roomsdb.update({[room]: data});
        }

        room.on('value', function(snapshot){
           console.log(snapshot.val());
           var val = snapshot.val(); editor.replaceRange(JSON.stringify(val, null, 3));
        });

        editor.on('change', function(changes){
           write();
            console.log(changes);
        });*/
        /********** ******** *********/
    });

    router.get('/login', function (req, res) {
        res.render("landingpage");
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/signup', function (req, res) {
        res.render("landingpage");
    });

    router.get("/codeEditor", function(req,res){
        res.render("codeEditor");
    });

    router.get("/room", isLoggedIn, function(req,res){
        // No room specified, list all rooms

        var roomQuery = "SELECT * FROM " + dbconfig.rooms_table;
        connection.query(roomQuery,  function(err, rows) {
            res.render("roomlist", {
                username: req.user.username,
                rooms: rows})
        });
    });

    router.get("/room/:roomId", function(req,res){
        var room = req.params.roomId;
        var roomQuery = "SELECT * FROM " + dbconfig.rooms_table + " WHERE id = (?)";
        connection.query(roomQuery, [req.params.roomId], function(err, rows) {

            // generate a fresh token for this client
            var token = opentok.generateToken(rows[0].sessionId);

            res.render("opentok", {
                id: req.params.roomId,
                apiKey: "45957952",
                sessionId: rows[0].sessionId,
                token: token});
        });
        /********** FIREBASE *********/
        /*roomsdb.update({[room]:'<h1>Hello World!</h1>'});*/
        /*var editor = $('#editor-value');
        function write(){
            var data = editor.getValue();
            console.log(data);
            roomsdb.update({[room]: data});
        }

        room.on('value', function(snapshot){
           console.log(snapshot.val());
           var val = snapshot.val(); editor.replaceRange(JSON.stringify(val, null, 3));
        });

        editor.on('change', function(changes){
           write();
            console.log(changes);
        });
*/
        /********** ******** *********/
    });

    router.get("/createroom", function(req,res){

        var room;
        opentok.createSession(function(err, session) {
            if (err) throw err;
            // Store session.sessionId in the database
            var insertQuery = "INSERT INTO " + dbconfig.rooms_table + "( sessionId ) VALUES (?)";
            connection.query(insertQuery, [session.sessionId], function(err, rows){
                console.log("created room " + rows.insertId);
                var roomId = rows.insertId;
                room = roomId;
                res.redirect('/terminal/'+roomId);
            });
        });
        /********** FIREBASE *********/
        /*roomsdb.update({[room]:'<h1>Hello World!</h1>'});*/
        /********** ******** *********/
    });

    router.post("/createroom", function(req,res){
        var room;
        opentok.createSession(function(err, session) {
            if (err) throw err;

            // Store session.sessionId in the database
            var insertQuery = "INSERT INTO " + dbconfig.rooms_table + "( sessionId ) VALUES (?)";
            connection.query(insertQuery, [session.sessionId], function(err, rows){
                console.log("created room " + rows.insertId);
                var roomId = rows.insertId;
                room = roomId;
                res.redirect('/terminal/'+roomId);
            });
        });
        /********** FIREBASE *********/
        /*roomsdb.update({[room]:'<h1>Hello World!</h1>'});*/
        /********** ******** *********/
    });

    router.get("/deleteroom/:roomId", function(req,res) {
        var roomQuery = "DELETE FROM " + dbconfig.rooms_table + " WHERE id = (?)";
        connection.query(roomQuery, [req.params.roomId], function(err, rows) {
            console.log("deleted " + req.params.roomId);
            res.redirect('/room');
        });
    });

    router.get("/companies", function(req,res){
        res.render("companies");
    });
    router.get("/classrooms", function(req,res){
        res.render("classrooms");
    });

    // DEBUG route to test global open tok session
    router.get("/opentok", function(req,res){
        var sessionId = app.get('sessionId');
        // generate a fresh token for this client
        var token = opentok.generateToken(sessionId);
        res.render("opentok", {
            id: "0",
            apiKey: "45957952",
            sessionId: sessionId,
            token: token});
    });

    router.post("/login", passport.authenticate('local-login', {
            successRedirect: "/room",
            failureRedirect: "/",
            failureFlash: false
        }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
        });

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/room');
        });

    app.get('/auth/facebook',
        passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/room');
        });

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/room');
        });

    router.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/room",
        failureRedirect: "/",
        failureFlash: false
    }));

    return router;
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}




