const express=require("express");
const router=express.Router();
const {verifyToken}=require("../middlewares/auth")
const {handleCreateTask,handleGetTasks,handleCompleteTask,handleDeleteTask}=require("../controllers/task");
router.post("/task-add",verifyToken,handleCreateTask);
router.get("/get-tasks",verifyToken,handleGetTasks);
router.put("/complete-task/:id",verifyToken,handleCompleteTask);
router.delete("/delete-task/:id",verifyToken,handleDeleteTask)
module.exports=router;