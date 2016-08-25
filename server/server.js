//var bodyParser = require('body-parser');
var express = require('express');
//var hbs = require('express-handlebars');
var path = require('path');
var Discogs = require('disconnect').Client;
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var config = require('./webpack.config');
var compiler = webpack(config);

//var index = require('./../routes/index');

var userAgent = 'VinylShelves/1.0';

var PORT = 3000;

var app = express();

// app.engine('hbs', hbs());
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(session({secret: '1234567890QWERTY'}));
// app.use(express.static('public'));
//
// app.get('/', index.get);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(express.static('./dist/'));

app.get('*', function (req, res){
    res.sendFile(path.resolve(__dirname, './dist/', 'index.html'))
});

// Discogs Oauth
app.get('/authorize', function(req, res) {
  var oAuth = new Discogs(userAgent).oauth();
  oAuth.getRequestToken(
    'lYPqTlgFzkkxSyKQojVB',
    'fwUKGbFwtuVhWsEKGVLDlDQVDUmkNDAA',
    'http://localhost:3000/callback',
    function(err, requestData) {
      req.session.requestData = requestData;
      res.redirect(requestData.authorizeUrl);
    }
  )
});

app.get('/callback', function(req, res) {
  var oAuth = new Discogs(userAgent, req.session.requestData).oauth();
  oAuth.getAccessToken(
    req.query.oauth_verifier,
    function(err, accessData) {
      req.session.accessData = accessData;
      res.send('Received access token!');
    }
  )
});

app.listen(PORT, function(err) {
    if (err) console.log(err);
    console.log('Web listening at http://localhost:' + PORT);
});
