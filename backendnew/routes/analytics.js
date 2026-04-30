const express = require("express");
const router = express.Router();

// TEMP: hardcoded (replace later with Mongo)
router.get("/", async (req, res) => {
  try {
    const data = {
      overview: [
        { label: "Total Students", value: 120 },
        { label: "Active Teachers", value: 10 },
      ],
      subjects: [
        { subject: "Physics", avgScore: 70 },
        { subject: "Math", avgScore: 80 },
      ],
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;