const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

router.get('/', (req, res) => {
  const keyword = req.query.keyword

  if (keyword === "") {
    return res.redirect('/')
  } else {
    return Restaurant.find({ name: { $regex: keyword, $options: 'i' } })
      .lean()
      .then((restaurants) => {
        const hasResults = restaurants.length > 0
        return res.render('index', { restaurants: restaurants, keyword: keyword, hasResults: hasResults, isSearch: true })
      })
      .catch((error) => console.log(error))
  }
})

module.exports = router
