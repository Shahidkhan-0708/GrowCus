 const mongoose=require("mongoose");
 const scoreSchema=new mongoose.Schema({
 subject:{
        required:true,
        type:String,
    },
    score:{
        required:true,
        type:Number,
    },
    studentId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
    },
    instituteId: { type: String, required:false },
})
scoreSchema.index({ subject: 1 });
scoreSchema.index({ instituteId: 1 });
scoreSchema.index({studentId:1,subject:1})
const Score=mongoose.model("Score",scoreSchema)
module.exports=Score
