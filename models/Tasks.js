const mongoose=require("mongoose");
const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
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
    priority:{
        type:String,
        required:false,
        default:"medium",
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
TaskSchema.index({ studentId: 1 });
TaskSchema.index({ status: 1 });
const taskSchema=mongoose.model("task",TaskSchema);
module.exports=taskSchema;
