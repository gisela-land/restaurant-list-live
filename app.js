const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')

const app = express()
const port = 3000

// connect mongodb
mongoose.connect('mongodb://localhost/rest-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB connect error!')
})

db.once('open', () => {
  console.log('MongoDB connect.')
})

// Set handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Set routes
app.use(express.static('public'))
app.use('/webfonts', express.static('./public/stylesheets/webfonts'))
// body-parser
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then((rests) => res.render('index', { restaurants: rests, hasResults: true }))
    .catch((error) => console.log(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  // console.log('*** req.body = ', req.body)
  return Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

// app.get('/restaurants/:rest_id', (req, res) => {
//   const restaurantId = req.params.rest_id;
//   const restaurant = restaurantList.results.find((rest) => {
//     return rest.id.toString() === restaurantId
//   })
//   res.render('show', { restaurant: restaurant })
// })

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const restaurants = restaurantList.results.filter((rest) => {
//     return rest.name.toLowerCase().includes(keyword.toLowerCase())
//   })
//   let hasResults = false
//   if (restaurants.length > 0) {
//     hasResults = true
//   }
//   res.render('index', { restaurants: restaurants, keyword: keyword, hasResults: hasResults })
// })

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
