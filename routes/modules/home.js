const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then((rests) => res.render('index', { restaurants: rests, hasResults: true }))
    .catch((error) => console.log(error))
})

module.exports = router
