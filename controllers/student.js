const User = require("../models/User")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

function canManageStudents(user) {
   return user && ["teacher", "admin"].includes(user.role)
}

const handleGetStudents = asyncHandler(async (req, res) => {
   if (!canManageStudents(req.user)) {
      throw new AppError("Students cannot access this resource", 403)
   }

   const query = req.user.role === "teacher" ? { assignedTeacher: req.user.userId } : { role: "student" }
   const students = await User.find(query).select("-password")

   return sendSuccess(res, { students }, "Students fetched")
})

const handleGetStudentById = asyncHandler(async (req, res) => {
   if (!canManageStudents(req.user)) {
      throw new AppError("Students cannot access this resource", 403)
   }

   const student = await User.findById(req.params.id).select("-password")

   if (!student || student.role !== "student") {
      throw new AppError("Student not found", 404)
   }

   return sendSuccess(res, { student }, "Student fetched")
})

const handleUpdateStudent = asyncHandler(async (req, res) => {
   if (!canManageStudents(req.user)) {
      throw new AppError("Students cannot access this resource", 403)
   }

   const { attendence, marks, isActive } = req.body
   const update = {
      ...(attendence !== undefined ? { attendence } : {}),
      ...(marks !== undefined ? { marks } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(req.user.role === "teacher" ? { assignedTeacher: req.user.userId } : {})
   }

   const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      update,
      { returnDocument: "after", projection: { password: 0 } }
   )

   if (!student) {
      throw new AppError("Student not found", 404)
   }

   return sendSuccess(res, { student }, "Student updated")
})

module.exports = {
   handleGetStudents,
   handleGetStudentById,
   handleUpdateStudent
}
