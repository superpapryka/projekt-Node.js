const express = require('express');
const router = express.Router();

const zleceniaController = require('../controllers/zleceniaController');

let ensureLoggedIn;
try {
    ensureLoggedIn = require('../middleware/auth').ensureLoggedIn;
} catch (e) {
    ensureLoggedIn = (req, res, next) => {
        if (req.session && req.session.user) return next();
        return res.status(401).render('pages/error', {
            title: 'Brak dostepu',
            message: 'Musisz sie zalogowac, aby złozyc zlecenie.'
        });
    };
}

router.get('/', ensureLoggedIn, zleceniaController.form);

router.post('/', ensureLoggedIn, zleceniaController.create);

module.exports = router;
