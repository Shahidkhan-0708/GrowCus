const express=require("express");
const router=express.Router();
const {handleGetDashBoard}=require("../controllers/User")
router.get("/dash-board",handleGetDashBoard);


module.exports= router;