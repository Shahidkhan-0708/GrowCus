const User=require("../models/User");
const bcrypt=require("bcryptjs")
const AppError=require("utiliy/AppError")
const DashboardStats=require("../models/DashboardStat")
const {setUser}=require("../services/auth")
const handleSignup = asyncHandler(async (req, res) => {
try{
const {name,email,password,role,instituteId}=req.body;
if(!name||!email||!password||!role||!instituteId){
    throw new AppError("missing fields", 409)
}

const existingUser=await User.findOne({email});
if(existingUser){
    return res.status(409).json({message:"Email already registered"})
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

res.status(201).json({
    message: "User registered successfully",
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        instituteId:user.instituteId,
        batch:user.batch,
        subject:user.subject,
    }
})
}catch(err){
    console.error("signup error:", err.message)
    res.status(500).json({message:err.message})
}
})

    const handleLogin = asyncHandler(async (req, res) => {
try{
const {email,password}=req.body;
if(!email||!password){
    return res.status(400).json({message:"missing fields"})
}
const user=await User.findOne({email});
if(!user){
    throw new AppError("Invalid username or email", 401)
    
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(400).json({message:"Invalid credentials"})
}
 const token=setUser(user);
 res.cookie("token",token,{httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
    maxAge:24*60*60*1000
 });
  res.status(200).json({
    message:"Successfully Login ",
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        batch:user.batch,
        subject:user.subject,
    }
  })

}catch(err){
    console.error("login error:", err.message)
    res.status(500).json({message:err.message})
}
})
module.exports={
    handleSignUp,handleLogin
}
