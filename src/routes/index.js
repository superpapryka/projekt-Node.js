const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Biznesowa Kompania Serwerowa' });
});

module.exports = router;
