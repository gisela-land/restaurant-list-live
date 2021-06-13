const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Restaurant = require('./models/restaurant.js')

const app = express()
const port = 3000
const categories = ["中東料理", "中式餐廳", "日本料理", "南洋料理", "義式餐廳", "美式餐廳", "酒吧", "咖啡", "甜點", "其他"]
const cateSelectStatus = []
for (let i = 0; i < categories.length; i++) {
  const cate = {}
  cate.name = categories[i]
  cate.selected = false
  cateSelectStatus.push(cate)
}

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
// method-override
app.use(methodOverride('_method'))

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

app.get('/restaurants/:rest_id', (req, res) => {
  const restId = req.params.rest_id;
  return Restaurant.findById(restId)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch((error) => console.log(error))
})

function checkSelectedCategory(category) {
  for (let i = 0; i < cateSelectStatus.length; i++) {
    if (cateSelectStatus[i].name === category) {
      cateSelectStatus[i].selected = true
    } else {
      cateSelectStatus[i].selected = false
    }
  }
  return cateSelectStatus
}

app.get('/restaurants/:rest_id/edit', (req, res) => {
  const restId = req.params.rest_id;
  return Restaurant.findById(restId)
    .lean()
    .then((restaurant) => {
      const cateStatus = checkSelectedCategory(restaurant.category)
      return res.render('edit', { restaurant: restaurant, newCategory: cateStatus })
    })
    .catch((error) => console.log(error))
})

app.put('/restaurants/:rest_id', (req, res) => {
  const id = req.params.rest_id

  return Restaurant.findById(id)
    .then((rest) => {
      rest.name = req.body.name
      rest.name_en = req.body.name_en
      rest.category = req.body.category
      rest.image = req.body.image
      rest.location = req.body.location
      rest.phone = req.body.phone
      rest.google_map = req.body.google_map
      rest.rating = req.body.rating
      rest.description = req.body.description
      return rest.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error))
})

app.delete('/restaurants/:rest_id', (req, res) => {
  const id = req.params.rest_id

  return Restaurant.findById(id)
    .then((rest) => rest.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  return Restaurant.find({ "name": { $regex: keyword, $options: 'i' } })
    .lean()
    .then((restaurants) => {
      const hasResults = (restaurants.length > 0) ? true : false
      return res.render('index', { restaurants: restaurants, keyword: keyword, hasResults: hasResults })
    })
    .catch((error) => console.log(error))

})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
