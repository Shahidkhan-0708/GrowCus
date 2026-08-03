const Report = require("../models/Report")

/**
 * Create a new report document.
 * @param {{ instituteId: string, generatedBy: string, types: string, data: object, generatedAt?: Date }} fields
 * @returns {Promise<object>} The created report
 */
async function createReportRecord({ instituteId, generatedBy, types, data, generatedAt }) {
   return Report.create({
      instituteId,
      generatedBy,
      types,
      data,
      generatedAt: generatedAt || new Date()
   })
}

/**
 * Fetch reports matching a query, sorted newest-first.
 * @param {object} [query={}]
 * @returns {Promise<object[]>} Formatted report list
 */
async function getReports(query = {}) {
   const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .lean()

   return reports.map((r) => ({
      id: String(r._id),
      instituteId: String(r.instituteId),
      generatedBy: r.generatedBy,
      types: r.types,
      data: r.data,
      generatedAt: r.generatedAt,
      createdAt: r.createdAt
   }))
}

/**
 * Fetch a single report by ID.
 * @param {string} reportId
 * @returns {Promise<object|null>}
 */
async function getReportById(reportId) {
   const report = await Report.findById(reportId).lean()
   if (!report) return null

   return {
      id: String(report._id),
      instituteId: String(report.instituteId),
      generatedBy: report.generatedBy,
      types: report.types,
      data: report.data,
      generatedAt: report.generatedAt,
      createdAt: report.createdAt
   }
}

module.exports = {
   createReportRecord,
   getReports,
   getReportById
}
