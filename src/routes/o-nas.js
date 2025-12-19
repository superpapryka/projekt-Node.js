const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/o-nas', { title: 'Kim jestesmy' });
});

module.exports = router;
