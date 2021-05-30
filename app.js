const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use('/webfonts', express.static('./public/stylesheets/webfonts'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost${port}`)
})
