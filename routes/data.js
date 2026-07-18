const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/role");
const { validate } = require("../middlewares/validate");
const {
   signupSchema,
   loginSchema,
   createStudentSchema,
   createTeacherSchema,
   createTaskSchema,
   updateTaskStatusSchema,
   createNotificationSchema,
   ariaChatSchema,
   createReportSchema,
} = require("../middlewares/schemas");
const { validateObjectId } = require("../middlewares/validate");

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

router.use(requireAuth);

router.get("/me", getMe);
router.get("/students", getStudents);
router.post("/students", allowRoles("teacher", "admin"), validate(createStudentSchema), createStudent);
router.get("/teachers", getTeachers);
router.post("/teachers", allowRoles("admin"), validate(createTeacherSchema), createTeacher);
router.get("/tasks", getTasks);
router.post("/tasks", allowRoles("teacher", "admin"), validate(createTaskSchema), createTask);
router.put("/tasks/:id/status", validateObjectId("id"), validate(updateTaskStatusSchema), updateTaskStatus);
router.delete("/tasks/:id", validateObjectId("id"), deleteTask);
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", validateObjectId("id"), markNotificationRead);
router.get("/risk", getRiskStudents);
router.get("/dashboard", getDashboard);
router.get("/progress", getProgress);

module.exports = router;
