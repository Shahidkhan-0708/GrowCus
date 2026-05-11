const mongoose=require("mongoose");
const subjectStatSchema=new mongoose.Schema({
    avgScore:{
        required:true,
        type:Number,
    },
    subject:{
        required:true,
        type:String,
    },
    count:{
        required:true,
        type:Number,
    }
},{timestamps:true});
const subjectStat=mongoose.model("subjectStat",subjectStatSchema)

module.exports=subjectStat