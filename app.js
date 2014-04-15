
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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

var codes = [
    require(__dirname + '/codes/1.json'),
    require(__dirname + '/codes/2.json'),
    require(__dirname + '/codes/3.json'),
    require(__dirname + '/codes/4.json'),
    require(__dirname + '/codes/5.json')
];

var fourohfour = '';
fs.readFile('views/404.html', function(err, contents){
    if(err) throw err;

    fourohfour = contents;
});

app.get('/', function(req, res){
    res.render('index', {
        classes: codes,
        _: _
    });
});

app.get('/:code([0-9]+)', function(req, res, next){
    var code = req.params.code;

    if(!/^[0-9]+$/.test(code)){
        next();
    } else {
        code = codes[code.substr(0, 1) - 1].codes[code];
        res.status(code.code);
        res.render('status_code', {
            code: code,
            _: _
        });
    }
});

app.use(function(req, res){
    res.write(fourohfour);
    res.status(404);
    res.end();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});