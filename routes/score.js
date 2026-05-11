const express=require("express")
const router=express.Router();
const {handleScore,handleDelete}=require("../controllers/score")
router.post("/add-score",handleScore)
router.delete("/delete-score",handleDelete);
module.exports=router
