const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");
const Report = require("../models/Report");

router.get("/", async (req, res) => {
  try {
    const [totalStudents, activeTeachers, subjects] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments({ role: "teacher" }),
      Report.aggregate([
        {
          $match: {
            subject: { $exists: true, $ne: null },
            score: { $type: "number" },
          },
        },
        {
          $group: {
            _id: "$subject",
            avgScore: { $avg: "$score" },
          },
        },
        {
          $project: {
            _id: 0,
            subject: "$_id",
            avgScore: { $round: ["$avgScore", 2] },
          },
        },
        { $sort: { subject: 1 } },
      ]),
    ]);

    const data = {
      overview: [
        { label: "Total Students", value: totalStudents },
        { label: "Active Teachers", value: activeTeachers },
      ],
      subjects,
    };

    res.json(data);
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
