var express = require('express');

var app =  express();

var fortune = require('./lib/fortune');

var credentials = require('./credentials');

// Set Static Middleware
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}));

app.set('port', process.env.PORT || 3000);

// Set Handlebar ViewEngine
var handlebars = require('express-handlebars')
  .create({ 
    defaultLayout: 'main',
    helpers: {
      section: function (name, options) {
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
  });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Set Page Test
app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

// Session Test
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash;
  // delete req.session.flash;
  next();
})

// Routes
app
  .get('/', function (req, res) {
    // var monster = req.cookie.monster;
    var signedMonster = req.signedCookies['signed_monster'];
    // console.log('monster: '+monster);
    console.log('signedMonster22: '+signedMonster);
    res.render('home');
  })
  .get('/about', function (req, res) {
    res.clearCookie('signed_monster')
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'sigened nom nom', { signed: true });
    res.render('about', {
      fortune: fortune.getFortune(),
      pageTestScript: '/qa/tests-about.js'
    });
  })
  .get('/tours/hood-river', function (req, res) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid'
    };
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
    if (req.xhr || req.accepts('json, html') === 'json') {
      res.send({ success: true });
    } else {
      res.redirect(303, '/thank-you');
    }
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