const express=require("express");
const router=express.Router();
const {handleGetDashBoard}=require("../controllers/User")
const {requireAuth}=require("../middlewares/auth")
router.get("/dash-board",requireAuth,handleGetDashBoard);


module.exports= router;
