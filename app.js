const express=require('express')
const cors=require('cors');
const app=express();
const path=require("path")
const {db}=require("./db/db")
const rateLimit=require("express-rate-limit")
const limit=rateLimit({
    windowMs:1,
    max:100,
})

const cookieparser=require("cookie-parser");
const {verifyToken}=require("./middlewares/auth")

require('dotenv').config()
const PORT=process.env.PORT
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({}))
app.use(cookieparser())
// app.set("view engine","ejs");
// app.set("views",path.resolve("./views"))

//routes
const authRoute=require("./routes/auth")
const userRoute=require("./routes/User");
const taskRoute=require("./routes/task")
const studentRoute=require("./routes/student")
const notificationRoute=require("./routes/notification")
const ariaRoute=require("./routes/aria")
const riskRoute=require("./routes/risk")

app.use("/auth",authRoute);
app.use("/user",verifyToken,userRoute);
app.use("/task",taskRoute);
app.use("/st",studentRoute);
app.use("/noti",notificationRoute);
app.use("/aria",ariaRoute,limit)
app.use("/risk",riskRoute);
const server=() => {
    db()
  app.listen(PORT,() => {
  console.log("ur listening to port: ",PORT)
}
)
}
server()



