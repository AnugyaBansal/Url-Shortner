const urlModel = require('../models/urlModel')

const createUrl = async function(req, res){
try{
    let data = req.body
    const saveUrl = await urlModel.create(data)
    res.status(201).send({status:true, data:saveUrl})

}catch(err){
  res.status(500).send({status: false, message:err.message})  
} 
}

module.exports={createUrl}