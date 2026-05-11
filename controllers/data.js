const bcrypt = require("bcryptjs");
const redisClient = require("../config/redis");
const User = require("../models/User");
const Task = require("../models/Tasks");
const Notification = require("../models/Notification");
const Report = require("../models/Report");
const Risk = require("../models/Riskscore");
const { formatTask, getTaskQueryForUser } = require("../services/taskData");
const {
  publicUserFields,
  getFormattedStudents,
  getStudentQueryForUser,
} = require("../services/studentData");

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId).select(publicUserFields);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      subject: user.subject,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getStudents(req, res) {
  try {
    res.json({ students: await getFormattedStudents(getStudentQueryForUser(req.user)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createStudent(req, res) {
  try {
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Only teachers or admins can add students" });
    }

    const { name, email, batch, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    const password = await bcrypt.hash("student123", 10);
    const student = await User.create({
      name,
      email,
      password,
      role: "student",
      batch,
      parentPhone: phone,
      assignedTeacher: req.user.role === "teacher" ? req.user.userId : undefined,
      isActive: true,
      xp: 0,
    });

    res.status(201).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTeachers(req, res) {
  try {
    const teachers = await User.find({ role: "teacher" }).select(publicUserFields).sort({ createdAt: -1 }).lean();
    const teacherIds = teachers.map((teacher) => teacher._id);
    const counts = await User.aggregate([
      { $match: { role: "student", assignedTeacher: { $in: teacherIds } } },
      { $group: { _id: "$assignedTeacher", studentsCount: { $sum: 1 } } },
    ]);
    const countByTeacher = new Map(counts.map((item) => [String(item._id), item.studentsCount]));

    res.json({
      teachers: teachers.map((teacher) => ({
        id: String(teacher._id),
        name: teacher.name,
        email: teacher.email,
        phone: teacher.parentPhone ? String(teacher.parentPhone) : "",
        subject: teacher.subject || "Unassigned",
        batches: teacher.batch ? [teacher.batch] : [],
        studentsCount: countByTeacher.get(String(teacher._id)) || 0,
        rating: 0,
        isActive: teacher.isActive ?? true,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTeacher(req, res) {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can add teachers" });

    const { name, email, phone, subject } = req.body;
    if (!name || !email || !subject) {
      return res.status(400).json({ error: "Name, email, and subject are required" });
    }

    const password = await bcrypt.hash("teacher123", 10);
    const teacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
      parentPhone: phone,
      subject,
      isActive: true,
      xp: 0,
    });

    res.status(201).json({ teacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTasks(req, res) {
  try {
    const tasks = await Task.find(getTaskQueryForUser(req.user))
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ tasks: tasks.map(formatTask) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTask(req, res) {
  try {
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Only teachers or admins can create tasks" });
    }

    const { title, description, subject, assignedTo, dueDate, priority } = req.body;
    if (!title || !subject || !assignedTo || !dueDate) {
      return res.status(400).json({ error: "Title, subject, assigned student, and due date are required" });
    }

    const task = await Task.create({
      title,
      description,
      subject,
      xp: 10,
      status: "pending",
      assignedTo,
      assignedBy: req.user.userId,
      deadline: dueDate,
      priority,
    });

    res.status(201).json({ task: formatTask(task) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: "after" });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ task: formatTask(task) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNotifications(req, res) {
  try {
    const query = req.user.role === "student" ? { studentId: req.user.userId } : { userId: req.user.userId };
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).lean();

    res.json({
      notifications: notifications.map((notification) => ({
        id: String(notification._id),
        type: notification.type,
        title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
        message: notification.message,
        timestamp: notification.createdAt,
        isRead: notification.isRead,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markNotificationRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { returnDocument: "after" });
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRiskStudents(req, res) {
  try {
    const students = await getFormattedStudents(getStudentQueryForUser(req.user));
    res.json({
      students: students.map((student) => ({
        ...student,
        lastCalculated: student.createdAt || new Date(),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const [students, teachers, tasks, reports, latestRisks, currentUser] = await Promise.all([
      getFormattedStudents(getStudentQueryForUser(req.user)),
      User.find({ role: "teacher" }).select(publicUserFields).lean(),
      Task.find(getTaskQueryForUser(req.user)).populate("assignedTo", "name email").sort({ createdAt: -1 }).lean(),
      Report.find({}).lean(),
      Risk.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      User.findById(req.user.userId).select(publicUserFields).lean(),
    ]);

    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const avgAttendance = students.length
      ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
      : 0;
    const atRiskCount = students.filter((student) => ["medium", "high", "critical"].includes(student.riskLevel)).length;

    res.json({
      role: req.user.role,
      stats: {
        totalStudents: students.length,
        activeTeachers: teachers.filter((teacher) => teacher.isActive ?? true).length,
        atRiskStudents: atRiskCount,
        tasksCompleted: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        avgAttendance,
        xp: currentUser?.xp || 0,
        reports: reports.length,
        latestRisks: latestRisks.length,
      },
      recentStudents: students.slice(0, 4),
      pendingTasks: tasks.filter((task) => task.status !== "completed").slice(0, 4).map(formatTask),
      teachers: teachers.slice(0, 3).map((teacher) => ({
        id: String(teacher._id),
        name: teacher.name,
        subject: teacher.subject || "Unassigned",
        students: students.filter((student) => String(student.assignedTeacher) === String(teacher._id)).length,
        rating: 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProgress(req, res) {
  try {
    const user = await User.findById(req.user.userId).select(publicUserFields).lean();
    const tasks = await Task.find({ assignedTo: req.user.userId }).sort({ createdAt: -1 }).lean();
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const subjectMap = new Map();

    tasks.forEach((task) => {
      const current = subjectMap.get(task.subject) || { subject: task.subject, topics: 0, completed: 0 };
      current.topics += 1;
      if (task.status === "completed") current.completed += 1;
      subjectMap.set(task.subject, current);
    });

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
    const subjectProgress = Array.from(subjectMap.values()).map((subject, index) => ({
      ...subject,
      progress: subject.topics ? Math.round((subject.completed / subject.topics) * 100) : 0,
      color: colors[index % colors.length],
    }));

    res.json({
      overallProgress: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
      topicsCompleted: completedTasks.length,
      xp: user?.xp || 0,
      streak: 0,
      subjectProgress,
      recentAchievements: completedTasks.slice(0, 3).map((task) => ({
        title: `${task.subject} task completed`,
        description: task.title,
        date: task.updatedAt || task.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMe,
  getStudents,
  createStudent,
  getTeachers,
  createTeacher,
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getNotifications,
  markNotificationRead,
  getRiskStudents,
  getDashboard,
  getProgress,
};
