const express = require('express');
const router = express.Router();

let orders = [];

router.get('/logowanie', (req, res) => {
    res.render('pages/logowanie', {
      title: 'Zaloguj sie na stronie',
      loginError: null,
      registerError: null,
      loginFormData: {},
      registerFormData: {}
    });
});
  

router.post('/', (req, res) => {
    const { nazwa, opis, kategoria } = req.body;

    if (!nazwa || !opis || !kategoria) {
        return res.status(400).send('Wszystkie pola muszą być wypełnione.');
    }

    orders.push({ nazwa, opis, kategoria });
    res.redirect('/');
});

module.exports = router;
