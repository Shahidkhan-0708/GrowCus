const jwt=require("jsonwebtoken")
const secret="@Shahid007@"

function setUser(user){
const payloads={
  userId:user._id,
  role:user.role,
}
try {
    return jwt.sign(payloads,secret);
   
} catch (error) {
    console.log("token is not created")
    return null
}
}

function getUser(token){
    try {
      return jwt.verify(token,secret);
      
    } catch (error) {
        console.log("jwt is not verified")
        return null;
    }


}
module.exports={
    setUser,getUser
}