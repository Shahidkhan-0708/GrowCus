const path=require("path")
require('dotenv').config({ path: path.join(__dirname, ".env") })

const express=require('express')
const cors=require('cors');
const app=express();
const {errorMiddleware}=require("./middlewares/error")
const logger=require("./middlewares/logger")
const AppError=require("./jobs/apiError")

const {addRedis}=require("./config/redis")
const {db}=require("./db/db")
const rateLimit=require("express-rate-limit")
const limit=rateLimit({
    windowMs:15*60*1000,
    max:100,
})

const cookieparser=require("cookie-parser");

const PORT=process.env.PORT|| 5000

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger)
app.use(cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
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
const reportRoute=require("./routes/report")



app.use("/api",dataRoute);
app.use("/auth",authRoute);
app.use("/user",userRoute);
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
app.use("/report",reportRoute);
app.use("/api/report",reportRoute);
app.use((req, res, next) => next(new AppError("Route not found", 404)));
app.use(errorMiddleware);
const server=async () => {
  try {
    await db()
  console.log("db connected")

  } catch (error) {
    console.error("DB Connection Error:", error.message)
    console.error("Container will crash now. Check MongoDB Atlas Network Access.")
    process.exit(1)
  }
   app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT, "bound to 0.0.0.0")
  })
}

server();
