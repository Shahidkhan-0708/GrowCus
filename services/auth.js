const jwt=require("jsonwebtoken")
const secret="@Shahid07@"

function setUser(user){
const payloads={
  userId:user._id,
  role:user.role,
  instituteId:user.instituteId
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