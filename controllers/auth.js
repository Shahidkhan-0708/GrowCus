const User=require("../models/User");
const bcrypt=require("bcryptjs")
const {setUser,getUser}=require("../services/auth")
async function handleSignUp(req,res){
const {name,email,password,role}=req.body;
if(!name||!email||!password||!role){
    return res.status(400).json({message:"missing fields"})
}
const hashedPassword=await bcrypt.hash(password,10);
await User.create({
name,email,password:hashedPassword,role
})
res.status(201).json({ message: "User registered successfully" })
}
async function handleLogin(req,res){
const {email,password,role}=req.body;
if(!email||!password||!role){
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
    maxAge:24*60*60*100
 });
 console.log(token)
 
  res.status(200).json({message:"Successfully Login "})

}
module.exports={
    handleSignUp,handleLogin
}