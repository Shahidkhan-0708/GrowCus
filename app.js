const path = require("path")
require('dotenv').config({ path: path.join(__dirname, ".env") })

const helmet = require("helmet")
const hpp = require("hpp")
const { authLimiter, apiLimiter, ariaLimiter, publicLimiter } = require("./middlewares/rateLimiter")


const express=require('express')
const cors=require('cors');
const app=express();
const {errorMiddleware}=require("./middlewares/error")
const logger=require("./middlewares/logger")
const AppError=require("./jobs/apiError")

const {addRedis}=require("./config/redis")
const {db}=require("./db/db")
// Tiered rate limiting imported from middlewares/rateLimiter


const cookieparser=require("cookie-parser");

const PORT=process.env.PORT|| 5000

// Security & standard middlewares
app.use(helmet())
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(hpp());

app.use(logger)
app.use(cors({
      origin: true,
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



app.use("/api", apiLimiter, dataRoute);
app.use("/auth", authLimiter, authRoute);
app.use("/user", apiLimiter, userRoute);
app.use("/task", apiLimiter, taskRoute);
app.use("/st", apiLimiter, studentRoute);
app.use("/noti", apiLimiter, notificationRoute);
app.use("/aria", ariaLimiter, ariaRoute)
app.use("/api/aria", ariaLimiter, ariaRoute)
app.use("/risk", apiLimiter, riskRoute);
app.use("/ana", apiLimiter, anaRoute);
app.use("/sc", apiLimiter, scoreRoute);
app.use("/sta", apiLimiter, statsRoute);
app.use("/api/analytics", apiLimiter, anaRoute);
app.use("/report", apiLimiter, reportRoute);
app.use("/api/report", apiLimiter, reportRoute);

app.use((req, res, next) => next(new AppError("Route not found", 404)));
app.use(errorMiddleware);
let checked=0;
const server=async () => {
  if(checked){
   next();
  }
  else{
     checked=1;
    try {
    await db()
  console.log("db connected")
  } catch (error) {
    console.error("DB Connection Error:", error.message)
    console.error("Container will crash now. Check MongoDB Atlas Network Access.")
    process.exit(1)
  }
  }

   app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT, "bound to 0.0.0.0")
  })
}

server();
