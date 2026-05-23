const {getUser}=require("../services/auth")
const AppError=require("../jobs/apiError")

function verifyToken(req,res,next){
    const token=req.cookies && req.cookies.token;
    if(token==null){
        return next(new AppError("Unauthorized", 401))
    }
   
   try {
      const user = getUser(token)
      if(!user){
         return next(new AppError("Invalid token", 401))
      }
      req.user = user
      next()
   } catch (err) {

      return next(new AppError("Invalid token", 401))
   }
    
}

function optionalAuth(req, res, next){
   const token=req.cookies && req.cookies.token

   if(!token){
      return next()
   }

   try {
      const user=getUser(token)
      if(user){
         req.user=user
      }
      return next()
   } catch (error) {
      return next()
   }
}

module.exports={
    verifyToken,
    requireAuth: verifyToken,
    optionalAuth
}
