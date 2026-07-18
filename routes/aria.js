const express=require("express");
const router=express.Router();
const {handleAriaChat}=require("../controllers/aria")
const { validate } = require("../middlewares/validate");
const { ariaChatSchema } = require("../middlewares/schemas");
router.post("/message-aria", validate(ariaChatSchema), handleAriaChat);

module.exports=router;


