var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var User     = require('../models/User');
var passport = require('../config/passport.js');

router.get('/', function (req,res) {
  if (req.isAuthenticated()){
    console.log("LogIn >> main");
    res.redirect('/main');
  }
  else {
    console.log("LogOut >> login");
    res.redirect('/login');
  }
});

router.get('/main', isLoggedIn, function (req,res) {
  //res.render('main/main',{user:req.user});
    User.find(function(err, users) {
			if (err) {
				console.error(err);
				return res.status(500).send({
					error: 'database fail!!!'
				});
			}

			res.render('main/main', {
				users: users,
        user:req.user
			});
		});
});


router.get('/login', function (req,res) {
  res.render('login/login', {
    user:req.user,
    email:req.flash("email")[0],
    loginError:req.flash('loginError'),
    loginMessage:req.flash('loginMessage'),

    formData: req.flash('formData')[0],
    emailError: req.flash('emailError')[0],
    nicknameError: req.flash('nicknameError')[0],
    passwordError: req.flash('passwordError')[0]
  });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/main',
  failureRedirect : '/login',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash("postsMessage", "Good-bye!");
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  console.log("::::True");
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
