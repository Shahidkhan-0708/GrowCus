const SubjectStat = require("../models/subjectStat")
const Score = require("../models/Score")
const DashboardStat = require("../models/DashboardStat")
const updateDashboardCache = require("../utility/updateDashBoardStat")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const handleScore = asyncHandler(async (req, res) => {
   const { studentId, subject, score, instituteId } = req.body
   const numericScore = Number(score)

   if (Number.isNaN(numericScore)) {
      throw new AppError("Score must be numeric", 400)
   }

   await Score.create({ studentId, subject, score: numericScore, instituteId })

   const stats = await SubjectStat.findOne({ subject })
   let avgScore = numericScore
   let count = 1

   if (!stats) {
      await SubjectStat.create({ subject, avgScore, count })
   } else {
      count = stats.count + 1
      avgScore = (stats.avgScore * stats.count + numericScore) / count
      await SubjectStat.updateOne({ subject }, { avgScore, count })
   }

   if (instituteId) {
      await DashboardStat.updateOne({ instituteId }, { avgScore, updatedAt: new Date() }, { upsert: true })
      await updateDashboardCache(instituteId)
   }

   return sendSuccess(res, { avgScore, count }, "Score added", 201)
})

const handleDelete = asyncHandler(async (req, res) => {
   const { subject, studentId, instituteId } = req.body
   const scoreDoc = await Score.findOne({ subject, studentId, ...(instituteId ? { instituteId } : {}) })

   if (!scoreDoc) {
      throw new AppError("Score not found", 404)
   }

   await Score.deleteOne({ _id: scoreDoc._id })

   const stat = await SubjectStat.findOne({ subject })
   if (!stat) {
      throw new AppError("Stats not found", 404)
   }

   if (stat.count <= 1) {
      await SubjectStat.deleteOne({ subject })
      if (instituteId) {
         await DashboardStat.updateOne({ instituteId }, { avgScore: 0, updatedAt: new Date() }, { upsert: true })
         await updateDashboardCache(instituteId)
      }
      return sendSuccess(res, { avgScore: 0, count: 0 }, "Last score deleted")
   }

   const count = stat.count - 1
   const avgScore = (stat.avgScore * stat.count - scoreDoc.score) / count
   await SubjectStat.updateOne({ subject }, { avgScore, count })

   if (instituteId) {
      await DashboardStat.updateOne({ instituteId }, { avgScore, updatedAt: new Date() }, { upsert: true })
      await updateDashboardCache(instituteId)
   }

   return sendSuccess(res, { avgScore, count }, "Score deleted")
})

module.exports = {
   handleScore,
   handleDelete
}
