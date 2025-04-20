const express = require("express");
const authRouter = express.Router();
const {
  handleSignIn,
  handleSignUp,
  fetchAllUsers,
} = require("../controllers/auth-controllers");

authRouter.post("/signup", handleSignUp);
authRouter.post("/signin", handleSignIn);
authRouter.get("/fetch-all-users", fetchAllUsers);
module.exports = authRouter;
