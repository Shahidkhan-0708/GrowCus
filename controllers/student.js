const { config } = require("dotenv")
const studentUser=require("../models/User")
const { truncate } = require("fs")

async function handleGetStudents(req,res){
    if(req.user.role==="teacher"||req.user.role==="admin"){
try{
    const student=await studentUser.find({assignedTeacher:req.user.userId})
    res.status(200).json(student)
    }catch(err){
       console.log(err)
    res.status(403).json({err:"students are not found"})
    }
}
else{
    res.status(403).json({err:"students cant access"})
}

}
async function handleGetStudentById(req,res){
const id=req.params.id;
if(req.user.role==="teacher"||req.user.role==="admin"){
try{
const idStudent=await studentUser.findById(id)
if(!idStudent||idStudent.role!=="student"){
    return res.status(403).json({err:"student not found"})
}
res.status(200).json(idStudent);
}catch(err){
res.status(403).json({err:"Invalid Id ,no student Found"})
}
}
else{
    res.status(403).json({err:"students cant access"})
}
}
async function handleUpdateStudent(req,res){
    if(req.user.role==="teacher"||req.user.role==="admin"){
    try{
 const id=req.params.id;
 const attendence=req.body.attendence;
 const marks=req.body.marks;
 const isActive=req.body.isActive;
 const upStudent=await studentUser.findByIdAndUpdate(id,{attendence,marks,isActive,assignedTeacher:req.user.userId},{returnDocument:"after",projection:{password:0}})
   res.status(200).json(upStudent)
    }catch(err){
   res.status(403).json({err:"student not updated"})
    }
}
else{
    res.status(403).json({err:"students cant access"})
}
}

module.exports={
    handleGetStudents,handleGetStudentById,handleUpdateStudent
}