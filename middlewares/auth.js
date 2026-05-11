const {getUser}=require("../services/auth")

function verifyToken(req,res,next){
    const token=req.cookies['token'];
    if(token==null){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
   
   try {
      const user = getUser(token)
      req.user = user
      next()
   } catch (err) {

      return res.status(401).json({
         message: "Invalid token"
      })
   }
    
}
module.exports={
    verifyToken
}