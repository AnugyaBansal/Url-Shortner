const urlModel = require('../models/urlModel')
const validator = require('../validation/validation')
const shortId = require('shortid')
const url = require("validator")


// ----------------------------------------------- Create URL --------------------------------------------------
const createUrl = async function (req, res) {
    try {
        let data = req.body
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty please provide data " })
        }
        if (!data.longUrl || !validator.isValid(data.longUrl)) {
            return res.status(400).send({ status: false, message: "Not a valid URL format. Please provide correct long url" })
        }
        if (!url.isURL(data.longUrl)) {
            return res.status(400).send({ status: false, msg: "Please Provide correct input for url" })
        }
        let duplicateUrl = await urlModel.findOne({ longUrl: data.longUrl }).select({urlCode: 1, longUrl: 1, shortUrl:1, _id:0})
        if (duplicateUrl) {
            return res.status(200).send({ status: true, data: duplicateUrl})
        }

        const urlCode = shortId.generate()
        const shortUrl = `http://localhost:3000/${urlCode}`


        data.urlCode = urlCode
        data.shortUrl = shortUrl

        let savedData = await urlModel.create(data)

        return res.status(201).send({
            status: true, data: {
                longUrl: savedData.longUrl,
                shortUrl: savedData.shortUrl,
                urlCode: savedData.urlCode,
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// ----------------------------------------------- GET URL --------------------------------------------------
const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
        if (!shortId.isValid(urlCode)) {
            return res.status(400).send({ status: false, message: "Url Code is not valid. Please provide correct input" })
        }

        const data = await urlModel.findOne({ urlCode: urlCode })
        if (!data) {
            return res.status(404).send({ status: false, message: "URL Code does not exist" })
        }

        return res.status(302).redirect(data.longUrl)

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createUrl, getUrl }
