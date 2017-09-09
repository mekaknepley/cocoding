module.exports = function(passport) {
    var express = require("express");

    var router = express.Router();

// Create all our routes and set up logic within those routes where required.
    router.get("/", function (req, res) {
        if (req.isAuthenticated())
        {
            res.redirect("/terminal");7
        } else {
            res.render("landingpage");
        }
    });

// Export routes for server.js to use.
module.exports = router;

    router.get('/terminal', isLoggedIn, function (req, res) {
        res.render("terminal", { username: req.user.username });
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

    router.post("/login", passport.authenticate('local-login', {
            successRedirect: "/terminal",
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

    router.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/terminal",
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

