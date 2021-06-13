const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search.js')

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/search', search)

module.exports = router

