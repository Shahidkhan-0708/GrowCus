const mongoose = require("mongoose");

const dashboardStatsSchema = new mongoose.Schema({

      instituteId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Institute",
         required: true,
         unique: true
      },

   totalStudents: Number,

   activeTeachers: Number,

   atRiskStudents: Number,

   avgAttendance: Number,

   totalTasks:Number,

   completedTasks:Number,

   tasksCompletedPercent: Number,

   reportsCount: Number,

   updatedAt: Date
});

module.exports =
   mongoose.model(
      "DashboardStats",
      dashboardStatsSchema
   );