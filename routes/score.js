const express=require("express")
const router=express.Router();
const {handleScore,handleDelete}=require("../controllers/score")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const {requireFields,validateObjectId}=require("../middlewares/validate")
router.post("/add-score",requireAuth,allowRoles("teacher","admin"),requireFields(["studentId","subject","score"]),validateObjectId("studentId","body"),handleScore)
router.delete("/delete-score",requireAuth,allowRoles("teacher","admin"),requireFields(["subject","studentId"]),validateObjectId("studentId","body"),handleDelete);
module.exports=router
