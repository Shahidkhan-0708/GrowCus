const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Score = require("../models/Score");
const redisClient = require("../config/redis");
const subjectStat = require("../models/subjectStat");
router.get("/", async (req, res) => {
  try {
    const [totalStudents, activeTeachers, subjects] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Score.aggregate([
        {
          $match: {
            subject: { $exists: true, $ne: null },
            score: { $type: "number" },
          },
        },
        {
          $group: {
            _id: "$subject",
            avgScore: { $avg: "$score" },
          },
        },
        {
          $project: {
            _id: 0,
            subject: "$_id",
            avgScore: { $round: ["$avgScore", 2] },
          },
        },
        { $sort: { subject: 1 } },
      ]),
    ]);

    const data = {
      overview: [
        { label: "Total Students", value: totalStudents },
        { label: "Active Teachers", value: activeTeachers },
      ],
      subjects,
    };

    res.json(data);
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/ana-stat",async(req,res)=>{
  try{
const cacheData=await redisClient.get("analytics");
//cache Hit
if(cacheData){
  console.log("Serving from redis")
  return res.json(JSON.parse(cachedData))

}
console.log("Fetch from mongoDb")
const subjects=await subjectStat.find().select("avgScore subject -_id")
const data={
  subjects,
}
await redisClient.set(
  "analytics",
  JSON.stringify(data),
  {
    EX:60,
  }
)
res.json(data);
  }catch(err){
  console.error(err);
  res.status(500).json({error:err.message})
  }
})

module.exports = router;
