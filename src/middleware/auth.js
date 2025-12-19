module.exports.ensureLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
  
    return res.status(401).render('pages/blad', {
      title: 'Biznesowa Kompania Serwerowa',
      message: 'Musisz byc zalogowany aby zamowic u nas zlecenie'
    });
  };
  