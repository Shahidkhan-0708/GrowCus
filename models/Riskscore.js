const mongoose=require("mongoose")
const RiskSchema=new mongoose.Schema({
studentId:{
   required:true,
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
},
riskLevel:{
   type:Number,
},
level:{
   type:String,
   required:true,
},
riskFactors:{
   type:[String],
},
calculatedAt:{
  required:true,
  type:Date,
}

    
},{timestamps:true})
const riskSchema=mongoose.model("Risk",RiskSchema)
module.exports=riskSchema