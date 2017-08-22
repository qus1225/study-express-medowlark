var express = require('express');

var app =  express();

var fortune = require('./lib/fortune');

// Set Static Middleware
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

// Set Handlebar ViewEngine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Routes
app
  .get('/', function (req, res) {
    res.render('home');
  })
  .get('/about', function (req, res) {
    res.render('about', {fortune: fortune.getFortune()});
  });

// custom 404 page
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});