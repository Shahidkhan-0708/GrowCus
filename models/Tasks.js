const mongoose=require("mongoose");
const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    xp:{
        required:true,
        type:Number,
    },
    status:{
        type:String,
        required:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
    }
},{timestamps:true});
const taskSchema=mongoose.model("task",TaskSchema);
module.exports=taskSchema;