const subjectStat=require("../models/subjectStat")
async function handleStat(req,res){
   
    const stats=await subjectStat.findOne().select("subject avgScore -_id")
    if(!stats){
        return res.status(400).json({err:"stats are empty"})
    }
    return res.status(200).json(stats) ;
}
module.exports={handleStat};