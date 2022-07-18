const express = require('express')
const bodyParser = require('body-parser')
const route = require('./routes/routes')
const mongoose = require('mongoose')
const app = express()


app.use(bodyParser.json())

mongoose.connect("mongodb+srv://alokgautam:oy9GeF3PH5mGv95i@cluster0.hqxfz.mongodb.net/group56Database-db", {
    useNewUrlParser: true
})
.then(()=>console.log("Mongodb is connected"))
.catch(err=>console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})