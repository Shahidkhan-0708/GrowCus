const express=require("express")
const router=express.Router();
const {handleScore,handleDelete}=require("../controllers/score")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const { validate, validateObjectId } = require("../middlewares/validate")
const { addScoreSchema, deleteScoreSchema } = require("../middlewares/schemas")
router.post("/add-score", requireAuth, allowRoles("teacher","admin"), validate(addScoreSchema), validateObjectId("studentId","body"), handleScore)
router.delete("/delete-score", requireAuth, allowRoles("teacher","admin"), validate(deleteScoreSchema), validateObjectId("studentId","body"), handleDelete);
module.exports=router
