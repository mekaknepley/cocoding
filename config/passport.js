var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection(dbconfig.localdbconnection);
}

connection.connect(function(err) {
    if (err) {
        console.error("error connection: " + err.stack);
    } else {
        console.log("passport connected to db");
    }
});

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = ?", [id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: "206249079912883",
            clientSecret: "2dc829085fe62300d0baaeeed8fccb21",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);

            connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE providerid = ? AND provider = 'facebook'", [profile.id], function(err, rows){
                if (err) {
                    return done(err);
                } else if (!rows.length) {
                    console.log("first facebook login, adding to database");

                    var newUser = {
                        username: profile.displayName,
                        password: "facebook",
                        providerid: profile.id
                    };

                    var insertQuery = "INSERT INTO " + dbconfig.users_table + "( username, password, providerid, provider ) VALUES (?,?,?,'facebook')";
                    connection.query(insertQuery, [newUser.username, newUser.password, newUser.providerid], function(err, rows){
                        newUser.id = rows.insertId;
                        return done(null, newUser);
                    });
                } else {
                    console.log(rows[0].username + " has logged in");
                    return done(null, rows[0]);
                }
            });
        }
    ));

    // Local Sign Up
    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done){
            //console.log("Signup from " + username + ":" + password);
            connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE username = ? AND provider = 'local'", [username], function(err, rows){
                if (err){
                    return done(err);
                } else if (rows.length) {
                    return done(null, false, "Username already in use.");
                } else {
                    var newUser = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)
                    };
                    var insertQuery = "INSERT INTO " + dbconfig.users_table + "( username, password, provider ) VALUES (?,?,'local')";
                    connection.query(insertQuery, [newUser.username, newUser.password], function(err, rows){
                       newUser.id = rows.insertId;
                       return done(null, newUser);
                    });
                }
            });
        })
    );

    passport.use(
      'local-login',
      new LocalStrategy({
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true
      },
      function(req, username, password, done) {
        connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE username = ? AND provider = 'local'", [username], function(err, rows){
          if (err) {
              return done(err);
          } else if (!rows.length) {
              return done(null, false, "User not found.");
          } else if (!bcrypt.compareSync(password, rows[0].password)) {
              return done(null, false, "Password incorrect.");
          } else {
              console.log(rows[0].username + " has logged in");
              return done(null, rows[0]);
          }
        });
      })
    );
};