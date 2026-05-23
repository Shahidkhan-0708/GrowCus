const Task = require("../models/Tasks")
const User = require("../models/User")
const Risk = require("../models/Riskscore")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const RISK_LEVELS = {
   0: "low",
   1: "low",
   2: "medium",
   3: "high"
}

const handleCalculatedRisk = asyncHandler(async (req, res) => {
   const studentId = req.params.id
   const student = await User.findById(studentId)

   if (!student || student.role !== "student") {
      throw new AppError("Student not found", 404)
   }

   const tasks = await Task.find({ assignedTo: studentId })
   const totalTasks = tasks.length
   const completedTasks = tasks.filter((task) => task.status === "completed").length
   const completedRate = totalTasks === 0 ? 1 : completedTasks / totalTasks
   const attendance = Number(student.attendence ?? 0)
   const marks = Number(student.marks ?? 0)
   const riskFactors = []

   if (completedRate < 0.5) riskFactors.push("low task completion")
   if (attendance < 75) riskFactors.push("low attendance")
   if (marks < 40) riskFactors.push("low marks")

   const riskLevel = riskFactors.length
   const level = RISK_LEVELS[riskLevel] || "critical"

   const risk = await Risk.findOneAndUpdate(
      { studentId },
      {
         level,
         studentId,
         riskLevel,
         riskFactors,
         calculatedAt: new Date()
      },
      { upsert: true, new: true }
   )

   return sendSuccess(res, { risk }, "Risk calculated")
})

module.exports = {
   handleCalculatedRisk
}
