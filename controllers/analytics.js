const User = require("../models/User")
const Score = require("../models/Score")
const redisClient = require("../config/redis")
const SubjectStat = require("../models/subjectStat")
const { asyncHandler, sendSuccess } = require("../utils/api")

const getAnalyticsOverview = asyncHandler(async (req, res) => {
   const [totalStudents, activeTeachers, subjects] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Score.aggregate([
         {
            $match: {
               subject: { $exists: true, $ne: null },
               score: { $type: "number" }
            }
         },
         {
            $group: {
               _id: "$subject",
               avgScore: { $avg: "$score" }
            }
         },
         {
            $project: {
               _id: 0,
               subject: "$_id",
               avgScore: { $round: ["$avgScore", 2] }
            }
         },
         { $sort: { subject: 1 } }
      ])
   ])

   return sendSuccess(res, {
      overview: [
         { label: "Total Students", value: totalStudents },
         { label: "Active Teachers", value: activeTeachers }
      ],
      subjects
   }, "Analytics fetched")
})

const getAnalyticsStats = asyncHandler(async (req, res) => {
   const cachedData = await redisClient.get("analytics")

   if (cachedData) {
      return sendSuccess(res, JSON.parse(cachedData), "Analytics fetched from cache")
   }

   const subjects = await SubjectStat.find().select("avgScore subject -_id")
   const data = { subjects }

   await redisClient.set("analytics", JSON.stringify(data), { EX: 60 })

   return sendSuccess(res, data, "Analytics fetched")
})

module.exports = {
   getAnalyticsOverview,
   getAnalyticsStats
}
