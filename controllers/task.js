const TaskSchema=require("../models/Tasks");
const User=require("../models/User")
async function handleCreateTask(req,res){
const {title,subject,xp,status,assignedTo,deadline}=req.body;
if(!title||!subject||!xp||!status||!assignedTo||!deadline){
    return res.status(403).json({error:"all fields must be filled"});
}
if(req.user.role==="teacher"||req.user.role==="admin"){
try{
    const Usertask=await TaskSchema.create({
    title,subject,xp,status,assignedTo,assignedBy:req.user.userId,deadline
})
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
       const updateTask=await TaskSchema.findByIdAndUpdate(id,{status:"completed"},{ returnDocument: 'after' });
       const xp=updateTask.xp
       const u1= await User.findByIdAndUpdate(req.user.userId,{
         $inc:{
             xp:updateTask.xp
         }
       })
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
        await TaskSchema.findByIdAndDelete(id)
        res.status(200).json({mess:"task deleted"})
    } catch (error) {
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