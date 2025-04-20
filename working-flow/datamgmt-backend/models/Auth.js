const mongoose = require("mongoose") ;
const dotenv = require("dotenv") ;
dotenv.config() ;

const authSchema = mongoose.Schema(
    {
        username: {
            type: String,
        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        organizationId:{
            type:String,
        },
    }
)
let authModel ;
if(mongoose.models.auths){
    authModel = mongoose.model("auths") ;
}
else{
    authModel = mongoose.model("auths",authSchema) ;
}
module.exports = authModel ;

