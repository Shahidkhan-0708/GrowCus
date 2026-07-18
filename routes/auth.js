const express=require("express");
const router=express.Router();
const {handleSignUp,handleLogin}=require("../controllers/auth");
const { validate } = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../middlewares/schemas");

router.post("/signup", validate(signupSchema), handleSignUp);
router.post("/login", validate(loginSchema), handleLogin);
module.exports=router;
