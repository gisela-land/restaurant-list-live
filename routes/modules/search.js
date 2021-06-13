const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/', (req, res) => {
  const keyword = req.query.keyword

  return Restaurant.find({ name: { $regex: keyword, $options: 'i' } })
    .lean()
    .then((restaurants) => {
      const hasResults = restaurants.length > 0
      return res.render('index', { restaurants: restaurants, keyword: keyword, hasResults: hasResults })
    })
    .catch((error) => console.log(error))
})

module.exports = router
