const DashboardStat=require("../models/DashboardStat")
const redisClient=require("../config/redis")
async function updateDashBoardCache(instituteId){
    const dashboard=await DashboardStat.findOne().lean();
    await redisClient.set(
        `dashboard:${instituteId}`,JSON.stringify("dashboard"),
        {EX:60}
    )
    console.log("Redis dashboard updated")

}
module.exports=updateDashBoardCache;