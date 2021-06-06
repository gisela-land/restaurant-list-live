const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const restObj = require('../../restaurant.json')

// connect mongodb
mongoose.connect('mongodb://localhost/rest-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB connect error!')
})

db.once('open', () => {
  console.log('MongoDB connect.')

  // Seed
  const restArray = restObj.results
  for (let i = 0; i < restArray.length; i++) {
    Restaurant.create({
      name: restArray[i].name,
      name_en: restArray[i].name_en,
      category: restArray[i].category,
      image: restArray[i].image,
      location: restArray[i].location,
      phone: restArray[i].phone,
      google_map: restArray[i].google_map,
      rating: restArray[i].rating,
      description: restArray[i].description,
    })
  }

  console.log('Done!')
})

