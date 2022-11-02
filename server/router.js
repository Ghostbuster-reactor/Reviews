const express = require('express')
const router = express.Router()

router.get('/reviews', (req, res) => res.send('i work?'))

module.exports = router