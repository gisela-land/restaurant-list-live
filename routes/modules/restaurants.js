const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')
const categories = ['中東料理', '中式餐廳', '日本料理', '南洋料理', '義式餐廳', '美式餐廳', '酒吧', '咖啡', '甜點', '其他']
const cateSelectStatus = []
for (let i = 0; i < categories.length; i++) {
  const cate = {}
  cate.name = categories[i]
  cate.selected = false
  cateSelectStatus.push(cate)
}

// GET 新增頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增一筆資料
router.post('/', (req, res) => {
  return Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

// 閱讀一筆資料
router.get('/:rest_id', (req, res) => {
  const restId = req.params.rest_id
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

// GET 編輯頁面
router.get('/:rest_id/edit', (req, res) => {
  const restId = req.params.rest_id
  return Restaurant.findById(restId)
    .lean()
    .then((restaurant) => {
      const cateStatus = checkSelectedCategory(restaurant.category)
      return res.render('edit', { restaurant: restaurant, newCategory: cateStatus })
    })
    .catch((error) => console.log(error))
})

// 編輯一筆資料
router.put('/:rest_id', (req, res) => {
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

// 刪除一筆資料
router.delete('/:rest_id', (req, res) => {
  const id = req.params.rest_id

  return Restaurant.findById(id)
    .then((rest) => rest.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

module.exports = router
