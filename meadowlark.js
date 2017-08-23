var express = require('express');

var app =  express();

var fortune = require('./lib/fortune');

// Set Static Middleware
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

// Set Handlebar ViewEngine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Set Page Test
app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

// Routes
app
  .get('/', function (req, res) {
    res.render('home');
  })
  .get('/about', function (req, res) {
    res.render('about', {
      fortune: fortune.getFortune(),
      pageTestScript: '/qa/tests-about.js'
    });
  })
  .get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
  })
  .get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
  })
  .get('/newsletter', function (req, res) {
    // use fake csrf value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
  })
  .post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
  })
  .get('/thank-you', function (req, res) {
    res.render('thankyou');
  })
;

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