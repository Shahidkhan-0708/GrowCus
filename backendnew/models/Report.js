const mongoose=require("mongoose");
const ReportSchema=new mongoose.Schema({
    instituteId:{
        required:true,
        type:String,
    },
    generatedBy:{
        required:true,
        type:String,
    },
    types:{
        required:true,
        type:String,
    },
    data:{
        required:true,
        type:String,
    },
    generatedAt:{
        required:true,
        type:String,
    },
    subject:{
        required:false,
        type:String,
    },
    score:{
        required:false,
        type:Number,
    },
    studentId:{
        required:false,
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
    }

},{timestamps:true})
const reportSchema=mongoose.model("Report",ReportSchema);
module.exports=reportSchema;
