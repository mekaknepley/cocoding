var express = require("express");

var router = express.Router();

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    res.render("index");
});

router.get("/codeEditor", function(req,res){
   res.render("codeEditor"); 
});

/*router.get("/room=?&user=?", function(req, res){
    res.render("collab"); 
});*/

// Export routes for server.js to use.
module.exports = router;