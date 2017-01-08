var express  = require('express');
var app      = express();
var path     = require('path');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');

// database
// mongoose.connect(process.env.MONGODB);
// var db = mongoose.connection;
// db.once("open",function () {
//   console.log("DB connected!");
// });
// db.on("error",function (err) {
//   console.log("DB ERROR :", err);
// });

// view engine
app.set("view engine", 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

// passport
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));

// start server
// var port = process.env.PORT || 3000;
// app.listen(port, function(){
//   console.log('Server On!');
// });
module.exports = app;
