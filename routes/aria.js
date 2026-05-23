const express=require("express");
const router=express.Router();
const {handleAriaChat}=require("../controllers/aria")
const {requireFields}=require("../middlewares/validate")
router.post("/message-aria",requireFields(["message"]),handleAriaChat);

module.exports=router;


