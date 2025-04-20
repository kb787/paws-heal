const {
  fetchAllChats,
  deleteChat,
} = require("../controllers/chat-controllers");
const express = require("express");
const chatRouter = express.Router();

chatRouter.get("/fetchAllChats", fetchAllChats);
chatRouter.delete("/delete-chat/:id", deleteChat);
module.exports = chatRouter;
