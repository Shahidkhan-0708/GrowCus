const taskStat=require("../models/taskStat")
const taskSchema=require("../models/task");

async function DashboardData(){
    const instituteId=req.user.instituteId
await DashboardStat.updateOne({instituteId},{
 totalTasks,completedTasks,tasksCompletedPercent:taskPercent,updatedAt:new Date()
},{upsert:true})
await updateDashBoardCache(instituteId)
}
module.exports={DashboardData}