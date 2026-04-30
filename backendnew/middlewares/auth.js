const {getUser}=require("../services/auth")

function verifyToken(req,res,next){
    const token=req.cookies['token'];
    if(token==null){
        return res.sendStatus(401);
    }
   const User= getUser(token);
   if(!User) return res.status(403).json({message:"Unauthorized"})
   
    req.user=User;
    next()
    
}
module.exports={
    verifyToken
}