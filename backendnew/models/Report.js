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
    }

},{timestamps:true})
const reportSchema=mongoose.model("Report",ReportSchema);
module.exports=reportSchema;