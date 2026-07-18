const express=require("express")
const router=express.Router();
const {handleGetStudents,handleGetStudentById,handleUpdateStudent}=require("../controllers/student")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const { validate, validateObjectId } = require("../middlewares/validate")
const { updateStudentSchema } = require("../middlewares/schemas")
router.use(requireAuth, allowRoles("teacher","admin"))
router.get("/get-students", handleGetStudents)
router.get("/get-student-by/:id", validateObjectId("id"), handleGetStudentById)
router.put("/update-student-by/:id", validateObjectId("id"), validate(updateStudentSchema), handleUpdateStudent)
module.exports=router;
