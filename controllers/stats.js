const SubjectStat = require("../models/subjectStat")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const handleStat = asyncHandler(async (req, res) => {
   const stats = await SubjectStat.find().select("subject avgScore count -_id")

   if (!stats.length) {
      throw new AppError("Stats are empty", 404)
   }

   return sendSuccess(res, { stats }, "Subject stats fetched")
})

module.exports = { handleStat }
