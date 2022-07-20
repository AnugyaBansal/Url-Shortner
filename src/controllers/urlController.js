const urlModel = require('../models/urlModel')
const validator = require('../validation/validation')
const shortId = require('shortid')
const url = require("validator")
const redis = require("redis");
const { promisify } = require("util");  


// Connect to Redis 

const redisClient = redis.createClient(                             
    11946,                                                          // port no
    "redis-11946.c301.ap-south-1-1.ec2.cloud.redislabs.com",        //endpoint
    { no_ready_check: true }
);
redisClient.auth("GIwvZbHchoQ60OmSax7wEANS3Bow4vsP",                //password - performing authentication
    function (err) {
        if (err) throw err;
    });

redisClient.on("connect", async function () {               // connecting to cache memory
    console.log("Connected to Redis..");
});


//Connection setup for redis - using SET and GET(binding with client)

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);     // promisify is a function wch returns callback instead promise.
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


// ----------------------------------------------- Create URL --------------------------------------------------
const createUrl = async function (req, res) {
    try {
        let data = req.body
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body is empty please provide data " })
        }
        if (!data.longUrl || !validator.isValid(data.longUrl)) {
            return res.status(400).send({ status: false, message: "Not a valid URL format. Please provide long url." })
        }

        //------------ validation of Long URL

        if (!url.isURL(data.longUrl)) {
            return res.status(400).send({ status: false, msg: "Please Provide correct input for url" })
        }

        //------------ Checking for duplicate longURL in DB
        let duplicateUrl = await urlModel.findOne({ longUrl: data.longUrl }).select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 })
        if (duplicateUrl) {
            return res.status(200).send({ status: true, data: duplicateUrl })
        }

        // ----------- Generating urlCode and shortURL
        const urlCode = shortId.generate()
        const shortUrl = `http://localhost:3000/${urlCode}`

        data.urlCode = urlCode
        data.shortUrl = shortUrl

        let savedData = await urlModel.create(data)
        await SET_ASYNC(`${savedData.urlCode}`, (savedData.longUrl))        // SET key and value using SET datatype in cache
        
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
        const urlCode = req.params.urlCode      // Getting data from params
        
        if (!shortId.isValid(urlCode)) {
            return res.status(400).send({ status: false, message: "Url Code is not valid Code. Please provide correct input" })
        }

        let cachedUrlCode = await GET_ASYNC(`${req.params.urlCode}`)        // Getting value of urlcode and storing it in cacheUrlCode
              
        if (cachedUrlCode) {
            return res.status(302).redirect(cachedUrlCode)
        } else {
            const data = await urlModel.findOne({ urlCode: urlCode })
            if (!data) {
                return res.status(404).send({ status: false, message: "URL Code does not exist" })
            }
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUrl, getUrl }
