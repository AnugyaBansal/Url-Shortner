const isValid = function(value){
    if(typeof value!=="undefined")return false
    if(typeof value!=="string") return false
    if(typeof value==="string"&& value.trim().length===0) return false
    return true;

}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

 module.exports={isValid,isValidRequestBody}