const User = require("../models/User")
const Risk = require("../models/Riskscore")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const handleGetDashBoard = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.userId).select("-password")

   if (!user) {
      throw new AppError("User is not logged in", 401)
   }

   if (req.user.role === "student") {
      const risk = await Risk.findOne({ studentId: req.user.userId }).sort({ createdAt: -1 })

      if (risk) {
         user.riskScore = risk.level
         await user.save()
      }
   }

   return sendSuccess(res, { user }, "Dashboard user fetched")
})

module.exports = { handleGetDashBoard }
