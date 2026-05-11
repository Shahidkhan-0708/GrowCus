const mongoose=require("mongoose");
const NotificationSchema=new mongoose.Schema({
    message:{
        required:true,
        type:String,
    },
    type:{
        type:String,
        required:true,
    },
    isRead:{
        type:Boolean,
        default:false,
        
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});
NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ createdAt: -1 });
const notificationSchema=mongoose.model("Notification",NotificationSchema)
module.exports=notificationSchema;