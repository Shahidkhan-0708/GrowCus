const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  getMe,
  getStudents,
  createStudent,
  getTeachers,
  createTeacher,
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getNotifications,
  markNotificationRead,
  getRiskStudents,
  getDashboard,
  getProgress,
} = require("../controllers/data");

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.get("/students", verifyToken, getStudents);
router.post("/students", verifyToken, createStudent);
router.get("/teachers", verifyToken, getTeachers);
router.post("/teachers", verifyToken, createTeacher);
router.get("/tasks", verifyToken, getTasks);
router.post("/tasks", verifyToken, createTask);
router.put("/tasks/:id/status", verifyToken, updateTaskStatus);
router.delete("/tasks/:id", verifyToken, deleteTask);
router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/:id/read", verifyToken, markNotificationRead);
router.get("/risk", verifyToken, getRiskStudents);
router.get("/dashboard", verifyToken, getDashboard);
router.get("/progress", verifyToken, getProgress);

module.exports = router;
