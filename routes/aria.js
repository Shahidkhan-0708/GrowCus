const express=require("express");
const router=express.Router();
const {handleAriaChat}=require("../controllers/aria")
router.post("/message-aria",handleAriaChat);

module.exports=router;


