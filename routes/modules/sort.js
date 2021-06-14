const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/:_option', (req, res) => {
  let _option = req.params._option
  if (_option === 'rating') {
    _option = '-' + _option
  }
  return Restaurant.find()
    .lean()
    .sort(_option)
    .then((rests) => res.render('index', { restaurants: rests, hasResults: true, isSorted: true, sortBy: req.params._option }))
    .catch((error) => console.log(error))
})

module.exports = router
