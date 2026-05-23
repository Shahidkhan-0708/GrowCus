const express=require("express");
const router=express.Router();
const {handleSignUp,handleLogin}=require("../controllers/auth");
const {requireFields}=require("../middlewares/validate");

router.post("/signup",requireFields(["name","email","password","role","instituteId"]),handleSignUp);
router.post("/login",requireFields(["email","password"]),handleLogin);
module.exports=router;
