const User=require("../models/User")
async function handleGetDashBoard(req,res){

const RiskSchema=require("../models/Riskscore")

if(req.user.role==="student"){
    try{
        const studentId=req.user.userId;
const risks=await RiskSchema.findById({studentId})
const risk=risks.level
const user=await User.findByIdAndUpdate(studentId,{riskScore:risk},{returnDocument:"after"}).select("-password")
   res.status(200).json({user});
    }catch(err){
        console.log(err)
   res.status(400).json({err:"user not present"})
    }
}
if(!user){
    return res.status(400).json({err:"user is not Logged In"})
}
return res.status(200).json({user})
}
module.exports={handleGetDashBoard};