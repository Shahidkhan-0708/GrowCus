const { config } = require("dotenv")
const taskSchema=require("../models/Tasks")
const userSchema=require("../models/User")
const riskSchema=require("../models/Riskscore")
async function handleCalculatedRisk(req,res){
   const studentId=req.params.id
   const student=await userSchema.findById(studentId);
   const tasks=await taskSchema.find({assignedTo:studentId});
   const totalTasks=tasks.length
   const completedTasks=tasks.filter(t=>t.status==="completed").length
   const completedRate=completedTasks/totalTasks
   const attendence=student.attendence;
   const marks=student.marks
   const calculatedAt=Date.now();
   const riskFactors=[];
   if(completedRate<0.5) riskFactors.push("low task completion")
   if(attendence<75) riskFactors.push("low attendence");
   if(marks<40) riskFactors.push("low marks")
      const riskLevel=riskFactors.length


let level;
   if(riskLevel==1){ level="low"}
   if(riskLevel===2){ level="middle"}
   if(riskLevel===3){ level="high"}
   if(riskLevel===4){ level="critical"}
   try{
   const Risk=await riskSchema.create({
     level,studentId,riskLevel,riskFactors,calculatedAt
   })
   res.status(200).json({Risk})
}catch(err){
  res.status(403).json({err:"risk is not calculated"})
}


}
module.exports={
handleCalculatedRisk
}