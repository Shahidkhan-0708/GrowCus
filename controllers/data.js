const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Task = require("../models/Tasks")
const Notification = require("../models/Notification")
const Report = require("../models/Report")
const Risk = require("../models/Riskscore")
const { formatTask, getTaskQueryForUser } = require("../services/taskData")
const {
   publicUserFields,
   getFormattedStudents,
   getStudentQueryForUser
} = require("../services/studentData")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const DEFAULT_STUDENT_PASSWORD = "student123"
const DEFAULT_TEACHER_PASSWORD = "teacher123"

const getMe = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.userId).select(publicUserFields).lean()

   if (!user) {
      throw new AppError("User not found", 404)
   }

   return sendSuccess(res, {
      user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         batch: user.batch,
         subject: user.subject
      }
   }, "Current user fetched")
})

const getStudents = asyncHandler(async (req, res) => {
   const students = await getFormattedStudents(getStudentQueryForUser(req.user))
   return sendSuccess(res, { students }, "Students fetched")
})

const createStudent = asyncHandler(async (req, res) => {
   const { name, email, batch, phone } = req.body
   const password = await bcrypt.hash(DEFAULT_STUDENT_PASSWORD, 10)
   const student = await User.create({
      name,
      email,
      password,
      role: "student",
      batch,
      parentPhone: phone,
      assignedTeacher: req.user.role === "teacher" ? req.user.userId : undefined,
      isActive: true,
      xp: 0
   })
   return sendSuccess(res, { student }, "Student created", 201)
})

const getTeachers = asyncHandler(async (req, res) => {
   const teachers = await User.find({ role: "teacher" }).select(publicUserFields).sort({ createdAt: -1 }).lean()
   const teacherIds = teachers.map((teacher) => teacher._id)
   const counts = await User.aggregate([
      { $match: { role: "student", assignedTeacher: { $in: teacherIds } } },
      { $group: { _id: "$assignedTeacher", studentsCount: { $sum: 1 } } }
   ])
   const countByTeacher = new Map(counts.map((item) => [String(item._id), item.studentsCount]))

   return sendSuccess(res, {
      teachers: teachers.map((teacher) => ({
         id: String(teacher._id),
         name: teacher.name,
         email: teacher.email,
         phone: teacher.parentPhone ? String(teacher.parentPhone) : "",
         subject: teacher.subject || "Unassigned",
         batches: teacher.batch ? [teacher.batch] : [],
         studentsCount: countByTeacher.get(String(teacher._id)) || 0,
         rating: 0,
         isActive: teacher.isActive ?? true
      }))
   }, "Teachers fetched")
})

const createTeacher = asyncHandler(async (req, res) => {
   const { name, email, phone, subject } = req.body
   const password = await bcrypt.hash(DEFAULT_TEACHER_PASSWORD, 10)
   const teacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
      parentPhone: phone,
      subject,
      isActive: true,
      xp: 0
   })

   return sendSuccess(res, { teacher }, "Teacher created", 201)
})

const getTasks = asyncHandler(async (req, res) => {
   const tasks = await Task.find(getTaskQueryForUser(req.user))
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean()

   return sendSuccess(res, { tasks: tasks.map(formatTask) }, "Tasks fetched")
})

const createTask = asyncHandler(async (req, res) => {
   const { title, description, subject, assignedTo, dueDate, priority } = req.body
   const task = await Task.create({
      title,
      description,
      subject,
      xp: 10,
      status: "pending",
      assignedTo,
      assignedBy: req.user.userId,
      deadline: dueDate,
      priority
   })

   return sendSuccess(res, { task: formatTask(task) }, "Task created", 201)
})

const updateTaskStatus = asyncHandler(async (req, res) => {
   const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
   )

   if (!task) {
      throw new AppError("Task not found", 404)
   }

   return sendSuccess(res, { task: formatTask(task) }, "Task status updated")
})

const deleteTask = asyncHandler(async (req, res) => {
   const task = await Task.findByIdAndDelete(req.params.id)

   if (!task) {
      throw new AppError("Task not found", 404)
   }

   return sendSuccess(res, { task }, "Task deleted")
})

const getNotifications = asyncHandler(async (req, res) => {
   const query = req.user.role === "student" ? { studentId: req.user.userId } : { userId: req.user.userId }
   const notifications = await Notification.find(query).sort({ createdAt: -1 }).lean()

   return sendSuccess(res, {
      notifications: notifications.map((notification) => ({
         id: String(notification._id),
         type: notification.type,
         title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
         message: notification.message,
         timestamp: notification.createdAt,
         isRead: notification.isRead
      }))
   }, "Notifications fetched")
})

const markNotificationRead = asyncHandler(async (req, res) => {
   const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: "after" }
   )

   if (!notification) {
      throw new AppError("Notification not found", 404)
   }

   return sendSuccess(res, { notification }, "Notification marked as read")
})

const getRiskStudents = asyncHandler(async (req, res) => {
   const students = await getFormattedStudents(getStudentQueryForUser(req.user))
   return sendSuccess(res, {
      students: students.map((student) => ({
         ...student,
         lastCalculated: student.createdAt || new Date()
      }))
   }, "Risk students fetched")
})

const getDashboard = asyncHandler(async (req, res) => {
   const [students, teachers, tasks, reports, latestRisks, currentUser] = await Promise.all([
      getFormattedStudents(getStudentQueryForUser(req.user)),
      User.find({ role: "teacher" }).select(publicUserFields).lean(),
      Task.find(getTaskQueryForUser(req.user)).populate("assignedTo", "name email").sort({ createdAt: -1 }).lean(),
      Report.find({}).lean(),
      Risk.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      User.findById(req.user.userId).select(publicUserFields).lean()
   ])

   const completedTasks = tasks.filter((task) => task.status === "completed").length
   const avgAttendance = students.length
      ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
      : 0
   const atRiskCount = students.filter((student) => ["medium", "high", "critical"].includes(student.riskLevel)).length

   return sendSuccess(res, {
      dashboard: {
         role: req.user.role,
         stats: {
            totalStudents: students.length,
            activeTeachers: teachers.filter((teacher) => teacher.isActive ?? true).length,
            atRiskStudents: atRiskCount,
            tasksCompleted: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
            avgAttendance,
            xp: currentUser?.xp || 0,
            reports: reports.length,
            latestRisks: latestRisks.length
         },
         recentStudents: students.slice(0, 4),
         pendingTasks: tasks.filter((task) => task.status !== "completed").slice(0, 4).map(formatTask),
         teachers: teachers.slice(0, 3).map((teacher) => ({
            id: String(teacher._id),
            name: teacher.name,
            subject: teacher.subject || "Unassigned",
            students: students.filter((student) => String(student.assignedTeacher) === String(teacher._id)).length,
            rating: 0
         }))
      }
   }, "Dashboard fetched")
})

const getProgress = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.userId).select(publicUserFields).lean()
   const tasks = await Task.find({ assignedTo: req.user.userId }).sort({ createdAt: -1 }).lean()
   const completedTasks = tasks.filter((task) => task.status === "completed")
   const subjectMap = new Map()

   tasks.forEach((task) => {
      const current = subjectMap.get(task.subject) || { subject: task.subject, topics: 0, completed: 0 }
      current.topics += 1
      if (task.status === "completed") current.completed += 1
      subjectMap.set(task.subject, current)
   })

   const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"]
   const subjectProgress = Array.from(subjectMap.values()).map((subject, index) => ({
      ...subject,
      progress: subject.topics ? Math.round((subject.completed / subject.topics) * 100) : 0,
      color: colors[index % colors.length]
   }))

   return sendSuccess(res, {
      progress: {
         overallProgress: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
         topicsCompleted: completedTasks.length,
         xp: user?.xp || 0,
         streak: 0,
         subjectProgress,
         recentAchievements: completedTasks.slice(0, 3).map((task) => ({
            title: `${task.subject} task completed`,
            description: task.title,
            date: task.updatedAt || task.createdAt
         }))
      }
   }, "Progress fetched")
})

module.exports = {
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
   getProgress
}
