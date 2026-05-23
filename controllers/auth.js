const User=require("../models/User");
const bcrypt=require("bcryptjs")
const asyncHandler=require("../jobs/asyncHandler")
const AppError=require("../jobs/apiError")
const DashboardStats=require("../models/DashboardStat")
const {setUser}=require("../services/auth")
const {sendSuccess}=require("../jobs/apiResponse")

const handleSignUp = asyncHandler(async (req, res) => {
const {name,email,password,role,instituteId}=req.body;
if(!name||!email||!password||!role||!instituteId){
    throw new AppError("Missing fields", 400)
}

const existingUser=await User.findOne({email});
if(existingUser){
    throw new AppError("Email already registered", 409)
}
const hashedPassword=await bcrypt.hash(password,10);
const user=await User.create({
name,email,password:hashedPassword,role,instituteId
})
if(role==="student"){
    await DashboardStats.updateOne(
   { instituteId },
   {
      $inc: {
         totalStudents: 1
      }
   }
)
}
if(role==="teacher"){
    await DashboardStats.updateOne(
   { instituteId },
   {
    $inc: {
         ActiveTeachers: 1
      }
   }
)
}
 const token=setUser(user);
 res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
    maxAge:24*60*60*1000
 });

return sendSuccess(res, {
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        instituteId:user.instituteId,
        batch:user.batch,
        subject:user.subject,
    }
}, "User registered successfully", 201)
})

    const handleLogin = asyncHandler(async (req, res) => {
const {email,password}=req.body;
if(!email||!password){
    throw new AppError("Missing fields", 400)
}
const user=await User.findOne({email});
if(!user){
    throw new AppError("Invalid username or email", 401)
    
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    throw new AppError("Invalid credentials", 401)
}
  // Attendance Automation
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  let hasLoggedToday = false;
  if (user.lastLoginDate) {
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);
      if (lastLogin.getTime() === today.getTime()) {
          hasLoggedToday = true;
      }
  }

  if (!hasLoggedToday) {
      user.attendence = (user.attendence || 0) + 1;
      user.lastLoginDate = new Date();
      await user.save();
  }

 const token=setUser(user);
 res.cookie("token",token,{httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
    maxAge:24*60*60*1000
 });
     return sendSuccess(res, {
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        batch:user.batch,
        subject:user.subject,
    }
  }, "Successfully Login", 200)

})
module.exports={
    handleSignUp,handleLogin
}
