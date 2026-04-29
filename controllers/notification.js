const notificationSchema=require("../models/Notification")

async function handleCreateNotification(req,res){
const {message,type,isRead,studentId}=req.body;

try{
const notify=await notificationSchema.create({
    message,type,studentId,userId:req.user.userId
})
res.status(200).json({notify});
}catch(err){
    console.log(err)
res.status(400).json({err:"notification is not created"})
}


}
async function handleGetNotification(req,res){
    if(req.user.role==="student"){
        try{
    const Snotifications=await notificationSchema.find({studentId:req.user.userId}).sort({createdAt:-1})
    res.status(200).json({Snotifications},{mess:"students received notification"});
        }catch(err){
   res.status(400).json({err:"notifications are not getting for students"})
        }
}
else{
    try{
    const Tnotifications=await notificationSchema.find({userId:req.user.userId}).sort({createdAt:-1})
    res.status(200).json({Tnotifications},{mess:"teacher sent notifications"})
    }catch(err){
        res.status(401).json({err:"notifications are not getting for teachers"})
    }
}
}
async function handlemarkAsRead(req,res){
    if(req.user.role==="student"){
        const sId=req.params.id
        try{
       const updateRead=await notificationSchema.findByIdAndUpdate(sId,{isRead:true},{returnDocument:"after"})
       res.status(200).json({updateRead});
        }catch(err){
     res.status(403).json({err:"notification not Read"})
        }
    }
    else{
        res.status(400).json({mess:"Access denied"})
    }
}
module.exports={
    handleCreateNotification,handleGetNotification,handlemarkAsRead
}