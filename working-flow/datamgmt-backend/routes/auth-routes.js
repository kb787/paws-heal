const express = require("express");
const authRouter = express.Router();
const {handleSignIn,handleSignUp} = require('../controllers/auth-controllers') ;

authRouter.post("/signup",handleSignUp) ;
authRouter.post("/signin",handleSignIn) ;
module.exports = authRouter ;