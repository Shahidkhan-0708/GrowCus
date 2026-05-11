const express=require('express')
const cors=require('cors');
const app=express();
const path=require("path")
const {errorMiddleware}=require("./middlewares/error")

const {addRedis}=require("./config/redis")
require('dotenv').config({ path: path.join(__dirname, ".env") })
const {db}=require("./db/db")
const rateLimit=require("express-rate-limit")
const limit=rateLimit({
    windowMs:1,
    max:100,
})

const cookieparser=require("cookie-parser");
const {verifyToken}=require("./middlewares/auth")

const PORT=process.env.PORT|| 5000

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
      origin:"*",
      credentials: true,
}))
app.use(cookieparser())



//routes
const authRoute=require("./routes/auth")
const userRoute=require("./routes/User");
const taskRoute=require("./routes/task")
const studentRoute=require("./routes/student")
const notificationRoute=require("./routes/notification")
const ariaRoute=require("./routes/aria")
const riskRoute=require("./routes/risk")
const anaRoute=require("./routes/analytics")
const dataRoute=require("./routes/data");
const scoreRoute=require("./routes/score")
const statsRoute=require("./routes/stats")



app.use("/api",dataRoute);
app.use("/auth",authRoute);
app.use("/user",verifyToken,userRoute);
app.use("/task",taskRoute);
app.use("/st",studentRoute);
app.use("/noti",notificationRoute);
app.use("/aria",ariaRoute,limit)
app.use("/api/aria",ariaRoute,limit)
app.use("/risk",riskRoute);
app.use("/ana",anaRoute);
app.use("/sc",scoreRoute);
app.use("/sta",statsRoute);
app.use("/api/analytics",anaRoute);
app.use(errorMiddleware);
const server=async () => {
  try {
    await db()
  console.log("db connected")

  } catch (error) {
    console.error("DB failed, but starting server anyway")
    process.exit(1)
  }
   app.listen(PORT, () => {
    console.log("Server running on port", PORT)
  })
}

server();
