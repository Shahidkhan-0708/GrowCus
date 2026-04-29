const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String,

    },
    email:{
        required:true,
        type:String,
    },
    password:{
        required:true,
        type:String,
    },
    role:{
        required:true,
        type:String,
    },
    xp:{
        required:true,
        type:Number,
        default:0,
    },
    batch:{
    type:String,
    required:false,
    },
   subject:{
    type:String,
    required:false,
   },
      parentPhone:{
       type:Number,
       required:false,
    },
    
    attendence:{
    type:Number,
    required:false,
    
    }
    ,
    marks:{
    type:Number,
    required:false,
   
   },
    instituteId:{
    type:String,
    required:false,
    
   },
     riskScore: { 
     type:String,
     required:false,
      },
       assignedTeacher:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:false
      },
    isActive:{
    type:Boolean,
    required:false,
   }

},{timestamps:true})
const userSchema=mongoose.model("User",UserSchema);
module.exports=userSchema;
