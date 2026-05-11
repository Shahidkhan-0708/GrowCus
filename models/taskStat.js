const mongoose=require("mongoose")
const taskStatSchema=new mongoose.Schema({
    instituteId:{
        type:String,
        required:false
    },
    completeRate:{
        required:true,
        type:Number,
    },
    totalTasks:{
      required:true,
        type:Number,
    },
    completedTasks:{
       required:true,
        type:Number,
    },
    updatedAt:{
        required:true,
        type:Date
    }
},{timestamps:true});
const taskStats=mongoose.model("taskStat",taskStatSchema)