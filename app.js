const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const routes = require('./routes')

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
// Set static files
app.use(express.static('public'))
app.use('/webfonts', express.static('./public/stylesheets/webfonts'))
// body-parser
app.use(express.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))
// routes module
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
