const urlModel = require('../models/urlModel')
const validator= require('../validation/validation')
const shortId= require('shortid')
const createUrl = async function(req, res){
    try{
        let data=req.body
        if(!validator.isValidRequestBody(data)){return res.status(400).send({status: false, message: "Body is empty please provide data "})}
        if(!data.longUrl){return res.status(400).send({status: false, message: "long url is required "})}
        //if(!validator.isValid(data.longUrl)){return res.status(400).send({status: false, message: "Long url is in wrong format "})}
        let duplicateUrl= await urlModel.findOne({longUrl:data.longUrl})
        if (duplicateUrl){
            return res.status(400).send({status: false ,message:"Long url already exist"})

        }

        const urlCode=shortId.generate()
        const shortUrl= `http://localhost:3000/${urlCode}`

        // const url= duplicateUrl
        // url["shortUrl","urlcode"]=savedData
        data.urlCode=urlCode
        data.shortUrl=shortUrl


        let savedData= await urlModel.create(data) 
        
        return res.status(201).send({status: false ,data:savedData})


    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }


}
  const getUrl=async function(req,res){
    try{
        const urlCode= req.params.urlCode
        const url=urlCode.toString()
        const data= await urlModel.findOne({urlCode:url})
        console.log(data)
        if(!data)
        return res.status(404). send({status: false , message:"url does not exist"})

        if(data.longUrl)
        return res.status(302).redirect({status:true ,message:"redirected"})


    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
  }
  

module.exports={createUrl,getUrl}