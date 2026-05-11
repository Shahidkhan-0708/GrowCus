const SubjectStat = require("../models/subjectStat");
const Score = require("../models/Score");
const redisClient = require("../config/redis");
const updateDashboardCache=require("../utility/updateDashboardStat")
const DashboardStat=require("../models/DashboardStat")
async function handleScore(req, res) {
  try {
    const { studentId, subject, score ,instituteId } = req.body;
    const numericScore = Number(score);

    if (!studentId || !subject || Number.isNaN(numericScore)) {
      return res.status(400).json({ err: "studentId, subject, and numeric score are required" });
    }

    await Score.create({ studentId, subject, score: numericScore });

    const stats = await SubjectStat.findOne({ instituteId,subject });
    if (!stats) {
      await SubjectStat.create({ subject, avgScore: numericScore, count: 1 });
    } else {
      const count = stats.count + 1;
      const avgScore = (stats.avgScore * stats.count + numericScore) / count;
      await SubjectStat.updateOne({ subject }, { avgScore, count });
    }
    await DashboardStat.updateOne({instituteId},{avgScore,updatedAt:new Date()},{upsert:true})
    updateDashboardCache();
    res.status(201).json({ message: "score added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleDelete(req, res) {
  try {
    const { subject, studentId ,instituteId} = req.body;
    if (!subject || !studentId||!instituteId) {
      return res.status(400).json({ error: "subject and studentId are required" });
    }

    const scoreDoc = await Score.findOne({ subject, instituteId });
    if (!scoreDoc) return res.status(404).json({ error: "Score not found" });

    await Score.deleteOne({ _id: scoreDoc._id });

    const stat = await SubjectStat.findOne({ subject , instituteId});
    if (!stat) return res.status(404).json({ error: "Stats not found" });

    if (stat.count <= 1) {
      await SubjectStat.deleteOne({subject});
      return res.json({ message: "last score deleted", avgScore: 0, count: 0 });
    }

    const count = stat.count - 1;
    const avgScore = (stat.avgScore * stat.count - scoreDoc.score) / count;
    await SubjectStat.updateOne({ subject }, { avgScore, count });
    await DashboardStat.updateOne({instituteId},{avgScore,updatedAt:new Date()},{upsert:true})

    updateDashboardCache(instituteId);
    res.json({ message: "score deleted", avgScore, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  handleScore,
  handleDelete,
};
