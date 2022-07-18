const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlController')

// ------------------------ POST and GET Url -----------------------------
router.post('/url/shorten', urlController.createUrl)

module.exports = router

