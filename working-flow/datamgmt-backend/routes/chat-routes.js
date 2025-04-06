const fetchAllChats = require("../controllers/chat-controllers");
const express = require("express");
const chatRouter = express.Router();

chatRouter.get("/fetchAllChats", fetchAllChats);
module.exports = chatRouter;
