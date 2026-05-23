const DashboardStat = require("../models/DashboardStat")
const redisClient = require("../config/redis")

async function updateDashBoardCache(instituteId) {
   const dashboard = await DashboardStat.findOne({ instituteId }).lean()

   await redisClient.set(
      `dashboard:${instituteId}`,
      JSON.stringify(dashboard || {}),
      { EX: 60 }
   )

   return dashboard
}

module.exports = updateDashBoardCache
