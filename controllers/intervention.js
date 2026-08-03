const Intervention = require("../models/Intervention")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

function canManageInterventions(user) {
   return user && ["teacher", "admin"].includes(user.role)
}

const handleCreateIntervention = asyncHandler(async (req, res) => {
   if (!canManageInterventions(req.user)) {
      throw new AppError("Students cannot create interventions", 403)
   }

   const { studentId, actionType, notes, status } = req.body

   const intervention = await Intervention.create({
      studentId,
      teacherId: req.user.userId,
      actionType,
      notes,
      status: status || "pending"
   })

   return sendSuccess(res, { intervention }, "Intervention created", 201)
})

const handleGetInterventions = asyncHandler(async (req, res) => {
   const query = canManageInterventions(req.user)
      ? { teacherId: req.user.userId }
      : { studentId: req.user.userId }

   const interventions = await Intervention.find(query).sort({ createdAt: -1 })

   return sendSuccess(res, { interventions }, "Interventions fetched")
})

const handleGetInterventionsByStudent = asyncHandler(async (req, res) => {
   if (!canManageInterventions(req.user)) {
      throw new AppError("Students cannot access this resource", 403)
   }

   const interventions = await Intervention.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })

   return sendSuccess(res, { interventions }, "Student interventions fetched")
})

const handleUpdateInterventionStatus = asyncHandler(async (req, res) => {
   if (!canManageInterventions(req.user)) {
      throw new AppError("Students cannot update interventions", 403)
   }

   const { status } = req.body
   const intervention = await Intervention.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.userId },
      { status },
      { returnDocument: "after" }
   )

   if (!intervention) {
      throw new AppError("Intervention not found", 404)
   }

   return sendSuccess(res, { intervention }, "Intervention status updated")
})

const handleDeleteIntervention = asyncHandler(async (req, res) => {
   if (!canManageInterventions(req.user)) {
      throw new AppError("Students cannot delete interventions", 403)
   }

   const intervention = await Intervention.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.userId
   })

   if (!intervention) {
      throw new AppError("Intervention not found", 404)
   }

   return sendSuccess(res, { intervention }, "Intervention deleted")
})

module.exports = {
   handleCreateIntervention,
   handleGetInterventions,
   handleGetInterventionsByStudent,
   handleUpdateInterventionStatus,
   handleDeleteIntervention
}
