
/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
// var cheerio = require('cheerio');

var routes = require('./routes');
//var MongoStore = require('connect-mongo')(express);
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/scrape',routes.scrape)
app.get("/runScraper", routes.runScraper);
// app.get('/users', user.list);
// app.post('/newJob',routes.newJob);
// app.get('/applications', routes.applications);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
