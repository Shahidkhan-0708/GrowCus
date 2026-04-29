const express=require("express")
const router=express.Router();
const {handleGetStudents,handleGetStudentById,handleUpdateStudent}=require("../controllers/student")
const {verifyToken}=require("../middlewares/auth")
router.get("/get-students",verifyToken,handleGetStudents)
router.get("/get-student-by/:id",verifyToken,handleGetStudentById)
router.put("/update-student-by/:id",verifyToken,verifyToken,handleUpdateStudent)
module.exports=router;