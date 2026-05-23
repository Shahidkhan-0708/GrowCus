const mongoose=require("mongoose");
const ReportSchema=new mongoose.Schema({
    instituteId:{
        required:true,
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
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
        type:mongoose.Schema.Types.Mixed,
    },
    generatedAt:{
        required:true,
        type:Date,
    },


},{timestamps:true})
ReportSchema.index({studentId:1});
ReportSchema.index({instituteId:1});
ReportSchema.index({createdAt:-1});
const reportSchema=mongoose.model("Report",ReportSchema);
module.exports=reportSchema;
