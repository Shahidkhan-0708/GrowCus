const Task = require("../models/Tasks")
const User = require("../models/User")
const TaskStat = require("../models/taskStat")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

function canManageTasks(user) {
   return user && ["teacher", "admin"].includes(user.role)
}

function statQueryFor(req, studentId) {
   return { instituteId: req.user.instituteId || String(studentId) }
}

async function recalculateTaskStats(query) {
   const stat = await TaskStat.findOne(query)
   if (!stat) return null

   const completedTasks = Math.max(Number(stat.completedTasks || 0), 0)
   const totalTasks = Math.max(Number(stat.totalTasks || 0), 0)
   const completeRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100

   return TaskStat.findOneAndUpdate(
      query,
      { completedTasks, totalTasks, completeRate, updatedAt: new Date() },
      { upsert: true, new: true }
   )
}

const handleCreateTask = asyncHandler(async (req, res) => {
   if (!canManageTasks(req.user)) {
      throw new AppError("Students cannot add tasks", 403)
   }

   const { title, subject, xp, status, assignedTo, deadline } = req.body
   const task = await Task.create({
      title,
      subject,
      xp,
      status,
      assignedTo,
      assignedBy: req.user.userId,
      deadline
   })

   const query = statQueryFor(req, assignedTo)
   await TaskStat.findOneAndUpdate(
      query,
      {
         $inc: { totalTasks: 1 },
         $setOnInsert: { completedTasks: 0, completeRate: 0 },
         updatedAt: new Date()
      },
      { upsert: true, new: true }
   )
   await recalculateTaskStats(query)

   return sendSuccess(res, { task }, "Task added", 201)
})

const handleGetTasks = asyncHandler(async (req, res) => {
   const query = canManageTasks(req.user)
      ? { assignedBy: req.user.userId }
      : { assignedTo: req.user.userId }

   const tasks = await Task.find(query).sort({ createdAt: -1 })

   return sendSuccess(res, { tasks }, "Tasks fetched")
})

const handleCompleteTask = asyncHandler(async (req, res) => {
   const task = await Task.findById(req.params.id)

   if (!task) {
      throw new AppError("Task not found", 404)
   }

   if (task.status === "completed") {
      throw new AppError("Task already completed", 400)
   }

   const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.userId },
      { status: "completed" },
      { new: true }
   )

   if (!updatedTask) {
      throw new AppError("Task not found", 404)
   }

   const query = statQueryFor(req, updatedTask.assignedTo)
   await TaskStat.findOneAndUpdate(
      query,
      {
         $inc: { completedTasks: 1 },
         $setOnInsert: { totalTasks: 0, completeRate: 0 },
         updatedAt: new Date()
      },
      { upsert: true, new: true }
   )
   await recalculateTaskStats(query)

   await User.findByIdAndUpdate(req.user.userId, {
      $inc: { xp: updatedTask.xp }
   })

   return sendSuccess(res, { task: updatedTask }, "Task completed")
})

const handleDeleteTask = asyncHandler(async (req, res) => {
   if (!canManageTasks(req.user)) {
      throw new AppError("Students cannot delete tasks", 403)
   }

   const task = await Task.findByIdAndDelete(req.params.id)

   if (!task) {
      throw new AppError("Task not found", 404)
   }

   const query = statQueryFor(req, task.assignedTo)
   await TaskStat.findOneAndUpdate(
      query,
      {
         $inc: {
            totalTasks: -1,
            completedTasks: task.status === "completed" ? -1 : 0
         },
         updatedAt: new Date()
      },
      { upsert: true, new: true }
   )
   await recalculateTaskStats(query)

   return sendSuccess(res, { task }, "Task deleted")
})

module.exports = {
   handleCreateTask,
   handleGetTasks,
   handleCompleteTask,
   handleDeleteTask
}
