const TaskSchema=require("../models/Tasks");
const User=require("../models/User")
const taskStats=require("../models/taskStat")
async function handleCreateTask(req,res){
    const {title,subject,xp,status,assignedTo,deadline}=req.body;
    const studentId=assignedTo
if(!title||!subject||!xp||!status||!assignedTo||!deadline){
    return res.status(403).json({error:"all fields must be filled"});
}
if(req.user.role==="teacher"||req.user.role==="admin"){
try{
    const Usertask=await TaskSchema.create({
    title,subject,xp,status,assignedTo,assignedBy:req.user.userId,deadline
})
   const currStat= await taskStats.findOneAndUpdate(
   studentId,
   {
      $inc: {
         totalTasks: 1
      }},{
        upsert:true,new:true
      }
)
const completedTasks=currStat.completedTasks;
const totalTasks=currStat.totalTasks
const completedPercent=totalTasks===0?0:(completedTasks/totalTasks)*100
await taskStats.updateOne(studentId,{completeRate:completedPercent},{upsert:true,new:true})

  res.status(200).json({mess:"task is successfully added"})
}catch(err){
    res.status(400).json({err:"task is not created"})
}
}
else{
    res.status(403).json({err:"student cant add task"})
}
}
async function handleGetTasks(req,res){
    if(req.user.role==="teacher"||req.user.role==="admin"){
        try {
    const teacherTasks=await TaskSchema.find({assignedBy:req.user.userId}).sort({created:-1})
       res.status(200).json({teacherTasks})
    } catch (error) {
        res.status(403).json({err:"tasks are not fetched"})
    }
}
else{
   try{
    const studentTasks=await TaskSchema.find({assignedTo:req.user.userId}).sort({created:-1});
    res.status(200).json({studentTasks})
   }catch(err){  
      res.status(400).json({err:"student Tasks failed"})
   }
}
}
async function handleCompleteTask(req,res){
    
    try {
       const id=req.params.id;
       const instituteId=req.user.instituteId
      
  const task= await TaskSchema.findById(id);

if(task.status === "completed") {
   return res.status(400).json({
      err: "Task already completed"
   });
}
       const updateTask =
   await TaskSchema.findOneAndUpdate(

      {
         _id: id,
         assignedTo: req.user.userId
      },

      {
         status: "completed"
      },

      {
         new: true
      }
   );
   if(!updateTask) {
   return res.status(404).json({
      err: "Task not found"
   });
}
       const studentId=updateTask.assignedTo
     const currStat=await taskStats.findOneAndUpdate(
   studentId,
   {
      $inc: {
         completedTasks: 1
      }},{upsert:true,new:true}
   
)
const completedTasks=currStat.completedTasks;
const totalTasks=currStat.totalTasks
const completedPercent=totalTasks===0?0:(completedTasks/totalTasks)*100
await taskStats.updateOne(studentId,{completeRate:completedPercent},{upsert:true,new:true})
       
const xp=updateTask.xp
       const u1= await User.findByIdAndUpdate(req.user.userId,{
         $inc:{
            xp:updateTask.xp
         }},{new:true}
       )
     res.status(200).json({updateTask})
   } catch (error) {
    console.log(error)
    res.status(400).json({err:"Update is not possible"})
   }
}
async function handleDeleteTask(req,res){
    if(req.user.role==="teacher"||req.user.role==="admin"){
    try {
        const id=req.params.id;
        const instituteId=req.user.instituteId
       const deletingTask= await TaskSchema.findByIdAndDelete(id)
        const studentId=deletingTask.assignedTo
        if(deletingTask.status==="completed"){
       const currStat= await taskStats.findOneAndUpdate(studentId,{$inc:{totalTasks:-1,completedTasks:-1}},{
            upsert:true,new:true
        })
        const completedTasks=currStat.completedTasks;
const totalTasks=currStat.totalTasks
const completedPercent=totalTasks===0?0:(completedTasks/totalTasks)*100
await taskStats.updateOne(studentId,{completeRate:completedPercent},{upsert:true, new: true})
    }
    else{
        const currStat= await taskStats.findByIdAndUpdate(studentId,{$inc:{totalTasks:-1}},{
            upsert:true,new:true
        })
         const completedTasks=currStat.completedTasks;
const totalTasks=currStat.totalTasks
const completedPercent=totalTasks===0?0:(completedTasks/totalTasks)*100
await taskStats.updateOne(studentId,{completeRate:completedPercent},{upsert:true,new:true})

    }
}
     catch (error) {
        console.log(error)
        res.status(400).json({err:"task is not deleted"})
    }
}
else{
    res.status(403).json({err:"student can not delete the task"})
}
}
module.exports={
    handleCreateTask,handleGetTasks,handleCompleteTask,handleDeleteTask
}