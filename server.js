// New Relic – must be the first line of code
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') require('newrelic');

// Module Dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var robots = require('robots.txt');

// Set Environment from ENV variable or default to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load Local Environment Variables
if (env === 'development') {
    var dotenv = require('dotenv');
    dotenv.load();
}

// Load Config
var config = require('./config/config');

// Set Port
var port = process.env.PORT || config.app.port;

// Connect MongoDB Database 
if (env === 'development') mongoose.connect(config.db);
if (env === 'production') mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', function(err) {
    console.log('Mongoose Connection Error: ' + err);
});

// Bootstrap Models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// CookieParser should be above session
app.use(cookieParser());

// Express Cookie-Based Session
app.use(session({
    name: 'iekoocNAEMETALPRELIOBTNAVRES', // Change these for your own application
    secret: 'NAEMETALPRELIOBTNAVRES', // Change these for your own application
    secureProxy: false, // Set to true if you have an SSL Certificate
    cookie: {
        secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
        maxAge: 864000000 // 10 Days in miliseconds
    }
}));

// Favicon
app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass any function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', './app/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

// Get req.body as JSON when receiving POST requests
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded

// Override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// Robots.txt
app.use(robots(__dirname + '/robots.txt'))

// Routes
require('./app/routes')(app); // pass our application into our routes

// Start Application
app.listen(port);
console.log('****** Servant Boilerplate ' + env + ' is now running on port ' + port + '  ******'); // shoutout to the user
exports = module.exports = app; // expose app

// End