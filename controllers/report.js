const Report = require("../models/Report")
const { asyncHandler, sendSuccess } = require("../utils/api")

const createReport = asyncHandler(async (req, res) => {
   const { instituteId, generatedBy, types, data, generatedAt } = req.body
   const report = await Report.create({
      instituteId,
      generatedBy,
      types,
      data,
      generatedAt: generatedAt || new Date()
   })

   return sendSuccess(res, { report }, "Report created", 201)
})

module.exports = {
   createReport
}
