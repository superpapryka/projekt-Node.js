const express = require('express');
const path = require('path');
const session = require('express-session');

const indexRoutes = require('./routes/index');
const zleceniaRoutes = require('./routes/zlecenia');
const authRoutes = require('./routes/auth');
const aboutRoutes = require('./routes/o-nas');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }  // na jeden dzien
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use('/', indexRoutes);
app.use('/zlecenia', zleceniaRoutes);
app.use('/auth', authRoutes);
app.use('/o-nas', aboutRoutes);

app.get('/404', (req, res) => {
  res.render('pages/404', { title: 'Strona nie znaleziona - 404' });
});

app.use((req, res, next) => {
  res.status(404).render('pages/404', { title: 'Strona nie znaleziona - 404' });
});

module.exports = app;
