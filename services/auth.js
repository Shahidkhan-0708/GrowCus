const jwt=require("jsonwebtoken")
const secret=process.env.JWT_SECRET || "@Shahid07@"

function setUser(user){
const payloads={
  userId:user._id,
  role:user.role,
  instituteId:user.instituteId
}
try {
    return jwt.sign(payloads,secret);
   
} catch (error) {
    return null
}
}

function getUser(token){
    try {
      return jwt.verify(token,secret);
    } catch (error) {
        return null;
    }


}
module.exports={
    setUser,getUser
}
