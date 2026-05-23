const express=require("express")
const router=express.Router();
const {handleGetStudents,handleGetStudentById,handleUpdateStudent}=require("../controllers/student")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const {validateObjectId}=require("../middlewares/validate")
router.use(requireAuth,allowRoles("teacher","admin"))
router.get("/get-students",handleGetStudents)
router.get("/get-student-by/:id",validateObjectId("id"),handleGetStudentById)
router.put("/update-student-by/:id",validateObjectId("id"),handleUpdateStudent)
module.exports=router;
