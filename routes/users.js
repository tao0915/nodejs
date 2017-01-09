var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var User     = require('../models/User');
var async    = require('async');

// new
router.get('/new', function(req,res){
  res.render('users/new', {
    formData: req.flash('formData')[0],
    emailError: req.flash('emailError')[0],
    nicknameError: req.flash('nicknameError')[0],
    passwordError: req.flash('passwordError')[0]
  });
});

// create
router.post('/', checkUserRegValidation, function(req,res,next){
  User.create(req.body.user, function (err,user) {
    if(err) return res.json({success:false, message:err});
    req.flash("loginMessage","Thank you for registration!");
    res.redirect('/login');
  });
});


module.exports = router;

function isLoggedIn(req, res, next) {
  console.log("::::True");
  if (req.isAuthenticated()){
    return next();
  }
  console.log("::::False");
  res.redirect('/');
}

function checkUserRegValidation(req, res, next) {
  var isValid = true;

  async.waterfall(
    [function(callback) {
      User.findOne({email: req.body.user.email, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("emailError","- This email is already resistered.");
          }
          callback(err, isValid);
        }
      );
    }, function(isValid, callback) {
      User.findOne({nickname: req.body.user.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("nicknameError","- This nickname is already resistered.");
          }
          callback(err, isValid);
        }
      );
    }], function(err, isValid) {
      if(err) return res.json({success:"false", message:err});
      if(isValid){
        return next();
      } else {
        req.flash("formData",req.body.user);
        res.redirect("back");
      }
    }
  );
}
