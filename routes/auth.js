const express=require("express");
const router=express();
const {handleSignUp,handleLogin}=require("../controllers/auth");
router.post("/signup",handleSignUp);
router.post("/login",handleLogin);
module.exports=router;