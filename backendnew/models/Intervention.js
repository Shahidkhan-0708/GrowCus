const mongoose=require("mongoose");
const InterventionSchema=new mongoose.Schema({
    studentId:{
        required:true,
        type:String,
        
    },
    
    teacherId:{
        required:true,
        type:String,

    },
    actionType:{
        required:true,
        type:String,
    },
    notes:{
        required:true,
        type:String,
    },
    status:{
        required:true,
        type:String,
    },
},{timestamps:true})
const interventionSchema=mongoose.model("Intervention",InterventionSchema);
module.exports=interventionSchema;