const authModel = require("./../models/Auth") ;
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const dotenv = require("dotenv") ;
const secret_key = process.env.secret_key ;
dotenv.config() ;

const handleSignUp = async(req,res) => {
    const {username,email,password,organizationId} = req.body ;
    if(!username || !email || !password || !organizationId){
        return res.status(400).json({message:"Entering all fields is mandatory",success:false}) ;
    }
    try {
        const existingUser = await authModel.findOne({email}) ;
        if(existingUser){
            return res.status(400).json({message:"User already exists",success:false}) ;
        }
        const hashedPassword = await bcrypt.hash(password,10) ;
        const newUser = await authModel.create({
            username,
            email,
            password:hashedPassword,
            organizationId,
        }) ;
        // console.log(newUser) ;
        return res.status(201).json({message:"User created successfully",success:true,newUser}) ;
    } catch (error) {
        console.error(error) ;
        return res.status(500).json({message:"Internal server error",success:false}) ;
    }
}

const handleSignIn = async(req,res) => {
    const {email,password} = req.body ;
    if(!email || !password){
        return res.status(400).json({message:"Entering all fields is mandatory",success:false}) ;
    }
    try {
        const existingUser = await authModel.findOne({email}) ;
        if(!existingUser){
            return res.status(400).json({message:"User does not exist",success:false}) ;
        }
        const isPasswordValid = await bcrypt.compare(password,existingUser.password) ;
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid credentials",success:false}) ;
        }
        const token = jwt.sign({id:existingUser._id},secret_key,{expiresIn:"1d"}) ;
        return res.status(200).json({message:"Login successful",success:true,token}) ;
    } catch (error) {
        console.error(error) ;
        return res.status(500).json({message:"Internal server error",success:false}) ;
    }
}

module.exports = {
    handleSignUp,
    handleSignIn,
}

