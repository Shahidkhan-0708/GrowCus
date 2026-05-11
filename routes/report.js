const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

router.post("/report", async (req, res) => {
  try {
    const { instituteId, generatedBy, types, data, generatedAt } = req.body;
    if (!instituteId || !generatedBy || !types || !data) {
      return res.status(400).json({ error: "instituteId, generatedBy, types, and data are required" });
    }

    const report = await Report.create({
      instituteId,
      generatedBy,
      types,
      data,
      generatedAt: generatedAt || new Date(),
    });

    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
