// src/controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.showLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('pages/logowanie', { error: null, title: 'Logowanie / Rejestracja' });
};

exports.register = async (req, res, next) => {
  try {
    const { nazwa, haslo, haslo2 } = req.body;

    if (!nazwa || !haslo || !haslo2) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        registerError: 'Wypelnij wszystkie pola rejestracji.',
        loginError: null,
        registerFormData: { nazwa: nazwa || '' },
        loginFormData: {}
      });
    }

    if (haslo !== haslo2) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        registerError: 'Podane hasla nie sa identyczne.',
        loginError: null,
        registerFormData: { nazwa },
        loginFormData: {}
      });
    }

    const User = require('../models/User');
    const { getDb } = require('../data/connection');

    let existingUser = null;
    if (User && typeof User.findByNazwa === 'function') {
      existingUser = await User.findByNazwa(nazwa);
    } else if (User && typeof User.findOne === 'function') {
      try { existingUser = await User.findOne({ nazwa }); } catch (e) { existingUser = null; }
    } else {
      const db = getDb();
      existingUser = await db.collection('users').findOne({ nazwa });
    }

    if (existingUser) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        registerError: 'Konto o tej nazwie juz istnieje.',
        loginError: null,
        registerFormData: { nazwa },
        loginFormData: {}
      });
    }

    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(haslo, 10);

    let insertResult;
    if (User && typeof User.create === 'function') {
      insertResult = await User.create({ nazwa, passwordHash });
    } else {
      const db = getDb();
      insertResult = await db.collection('users').insertOne({ nazwa, passwordHash });
    }

    req.session.user = { id: insertResult.insertedId || insertResult._id || insertResult, nazwa };
    return res.redirect('/');
  } catch (err) {
    console.error('Blad w rejestracji:', err);
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { nazwa, haslo } = req.body;

    if (!nazwa || !haslo) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        loginError: 'Podaj nazwe i haslo.',
        registerError: null,
        loginFormData: { nazwa: nazwa || '' },
        registerFormData: {}
      });
    }

    const User = require('../models/User');
    const { getDb } = require('../data/connection');

    let dbUser = null;
    if (User) {
      if (typeof User.findByNazwa === 'function') {
        dbUser = await User.findByNazwa(nazwa);
      } else if (typeof User.findByName === 'function') {
        dbUser = await User.findByName(nazwa);
      } else if (typeof User.findOne === 'function') {
        try { dbUser = await User.findOne({ nazwa }); } catch (e) { dbUser = null; }
      }
    }
    if (!dbUser) {
      const db = getDb();
      dbUser = await db.collection('users').findOne({ nazwa });
    }

    if (!dbUser) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        loginError: 'Uzytkownik z taka nazwa nie istnieje.',
        registerError: null,
        loginFormData: { nazwa },
        registerFormData: {}
      });
    }

    const storedHash = dbUser.passwordHash || dbUser.haslo || dbUser.password;
    if (!storedHash) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        loginError: 'Problem z kontem (brak hasla).',
        registerError: null,
        loginFormData: { nazwa },
        registerFormData: {}
      });
    }

    const bcrypt = require('bcrypt');
    const ok = await bcrypt.compare(haslo, storedHash);
    if (!ok) {
      return res.render('pages/logowanie', {
        title: 'Zaloguj sie na stronie',
        loginError: 'Podane haslo jest bledne.',
        registerError: null,
        loginFormData: { nazwa },
        registerFormData: {}
      });
    }

    req.session.user = { id: dbUser._id || dbUser.insertedId || dbUser.id, nazwa: dbUser.nazwa || nazwa };
    return res.redirect('/');
  } catch (err) {
    console.error('Blad w logowaniu:', err);
    return next(err);
  }
};

exports.logout = (req, res, next) => {
  console.log('>>> GET /auth/logout');
  req.session.destroy(err => {
    if (err) {
      console.error('Blad niszczenia sesji:', err);
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
