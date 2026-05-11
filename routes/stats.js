const express=require("express");
const router=express.Router();

const {handleStat}=require("../controllers/stats")
router.get("/subject-stats",handleStat);
module.exports=router