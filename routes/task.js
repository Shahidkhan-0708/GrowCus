const express=require("express");
const router=express.Router();
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const { validate, validateObjectId } = require("../middlewares/validate")
const { createTaskAltSchema } = require("../middlewares/schemas")
const { handleCreateTask, handleGetTasks, handleCompleteTask, handleDeleteTask } = require("../controllers/task");
router.use(requireAuth)
router.post("/task-add", allowRoles("teacher","admin"), validate(createTaskAltSchema), validateObjectId("assignedTo","body"), handleCreateTask);
router.get("/get-tasks",handleGetTasks);
router.put("/complete-task/:id",validateObjectId("id"),handleCompleteTask);
router.delete("/delete-task/:id",allowRoles("teacher","admin"),validateObjectId("id"),handleDeleteTask)
module.exports=router;
