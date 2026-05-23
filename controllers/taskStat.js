const TaskStat = require("../models/taskStat")
const updateDashboardCache = require("../utility/updateDashBoardStat")

async function DashboardData({ instituteId, totalTasks = 0, completedTasks = 0 }) {
   const completeRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100

   const stats = await TaskStat.findOneAndUpdate(
      { instituteId },
      {
         totalTasks,
         completedTasks,
         completeRate,
         updatedAt: new Date()
      },
      { upsert: true, new: true }
   )

   await updateDashboardCache(instituteId)
   return stats
}

module.exports = { DashboardData }
