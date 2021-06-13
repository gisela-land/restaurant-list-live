const Restaurant = require('../restaurant.js')
const restObj = require('../../restaurant.json')
const db = require('../../config/mongoose.js')

db.once('open', () => {
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
      description: restArray[i].description
    })
  }

  console.log('Done!')
})
