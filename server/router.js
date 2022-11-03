const express = require('express')
const router = express.Router()
const reviews = require('./Controllers/reviews.js')

router.get('/reviews', (req, res) => reviews.get(req, res))

module.exports = router