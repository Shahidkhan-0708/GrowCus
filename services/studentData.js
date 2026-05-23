const User = require("../models/User");
const Task = require("../models/Tasks");

const publicUserFields = "-password";

function riskFromStudent(student, taskCompletion) {
  const attendance = Number(student.attendence ?? student.attendance ?? 0);
  const marks = Number(student.marks ?? 0);
  const riskFactors = [];

  if (attendance < 75) riskFactors.push("low attendance");
  if (marks < 40) riskFactors.push("low marks");
  if (taskCompletion < 50) riskFactors.push("low task completion");

  let riskLevel = "low";
  if (riskFactors.length >= 3) riskLevel = "critical";
  else if (riskFactors.length === 2) riskLevel = "high";
  else if (riskFactors.length === 1) riskLevel = "medium";

  return { riskLevel, riskFactors };
}

async function getFormattedStudents(query = {}) {
  const students = await User.find({ role: "student", ...query })
    .select(publicUserFields)
    .sort({ createdAt: -1 })
    .lean();

  const studentIds = students.map((student) => student._id);
  const taskStats = await Task.aggregate([
    { $match: { assignedTo: { $in: studentIds } } },
    {
      $group: {
        _id: "$assignedTo",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
      },
    },
  ]);

  const statsByStudent = new Map(
    taskStats.map((stat) => [
      String(stat._id),
      stat.total ? Math.round((stat.completed / stat.total) * 100) : 0,
    ])
  );
  return students.map((student) => {
    const taskCompletion = statsByStudent.get(String(student._id)) ?? 0;
    const risk = riskFromStudent(student, taskCompletion);

    return {
      id: String(student._id),
      name: student.name,
      email: student.email,
      batch: student.batch || "Unassigned",
      subject: student.subject || "Unassigned",
      phone: student.parentPhone ? String(student.parentPhone) : "",
      attendance: Number(student.attendence ?? 0),
      marks: Number(student.marks ?? 0),
      riskLevel: student.riskScore || risk.riskLevel,
      riskFactors: risk.riskFactors,
      taskCompletion,
      isActive: student.isActive ?? true,
      xp: student.xp ?? 0,
      createdAt: student.createdAt,
      assignedTeacher: student.assignedTeacher,
    };
  });
}

function getStudentQueryForUser(user) {
  return user.role === "teacher" ? { assignedTeacher: user.userId } : {};
}

module.exports = {
  publicUserFields,
  riskFromStudent,
  getFormattedStudents,
  getStudentQueryForUser,
};
