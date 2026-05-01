const User=require("../models/User");
const bcrypt=require("bcryptjs")
const {setUser}=require("../services/auth")
async function handleSignUp(req,res){
const {name,email,password,role}=req.body;
if(!name||!email||!password||!role){
    return res.status(400).json({message:"missing fields"})
}
const hashedPassword=await bcrypt.hash(password,10);
const user=await User.create({
name,email,password:hashedPassword,role
})
 const token=setUser(user);
 res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    maxAge:24*60*60*1000
 });
res.status(201).json({
    message: "User registered successfully",
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        batch:user.batch,
        subject:user.subject,
    }
})
}
async function handleLogin(req,res){
const {email,password}=req.body;
if(!email||!password){
    return res.status(400).json({message:"missing fields"})
}
const user=await User.findOne({email});
if(!user){
    return res.json({
        error:"Invalid username or email"
    })
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(400).json({message:"Invalid credentials"})
}


 const token=setUser(user);

 res.cookie("token",token,{httpOnly:true,
    secure:false,
    sameSite:"lax",
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

}
module.exports={
    handleSignUp,handleLogin
}
