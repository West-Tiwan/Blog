var express = require('express');
var router = express.Router();
const upload = require('./multer.js');
const passport = require('passport');
const localStratergy = require('passport-local');
var userModel = require('./users.js');
var postModel = require('./post.js');
passport.use(new localStratergy(userModel.authenticate()));

function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
