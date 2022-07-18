const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlController')

// ------------------------ Create URL -----------------------------
router.post('/url/shorten', urlController.createUrl)

// ------------------------ GET /:urlCode -----------------------------
router.get('/:urlCode', urlController.getUrl)

module.exports = router

