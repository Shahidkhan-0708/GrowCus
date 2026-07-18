/**
 * Strict Zod schemas for every input surface in the app.
 * These REJECT non-conforming data — they do not sanitize or coerce.
 */

const { z } = require("zod")
const { validation: v } = require("../config/security")

// ── Reusable primitives ────────────────────────────────────────

const mongoId = z.string().regex(/^[a-f0-9]{24}$/, "Invalid ID format")

const email = z
   .string()
   .email("Invalid email format")
   .max(v.email.max, `Email must be at most ${v.email.max} characters`)
   .transform((e) => e.toLowerCase().trim())

const name = z
   .string()
   .min(v.name.min, "Name is required")
   .max(v.name.max, `Name must be at most ${v.name.max} characters`)
   .regex(/^[a-zA-Z\s.\-']+$/, "Name contains invalid characters")

const password = z
   .string()
   .min(v.password.min, `Password must be at least ${v.password.min} characters`)
   .max(v.password.max, `Password must be at most ${v.password.max} characters`)

const role = z.enum(v.role, { message: `Role must be one of: ${v.role.join(", ")}` })

const phone = z
   .string()
   .max(v.phone.max, `Phone must be at most ${v.phone.max} characters`)
   .regex(/^[0-9+\-() ]*$/, "Phone contains invalid characters")
   .optional()

// ── Auth Schemas ───────────────────────────────────────────────

const signupSchema = z.object({
   name,
   email,
   password,
   role,
   instituteId: z
      .string()
      .min(v.instituteId.min, "Institute ID is required")
      .max(v.instituteId.max, `Institute ID must be at most ${v.instituteId.max} characters`),
}).strict()

const loginSchema = z.object({
   email,
   password: z.string().min(1, "Password is required").max(v.password.max),
}).strict()

// ── Student Schemas ────────────────────────────────────────────

const createStudentSchema = z.object({
   name,
   email,
   batch: z.string().max(v.batch.max).optional(),
   phone,
}).strict()

const updateStudentSchema = z.object({
   attendence: z.number().min(v.attendance.min).max(v.attendance.max).optional(),
   marks: z.number().min(v.marks.min).max(v.marks.max).optional(),
   isActive: z.boolean().optional(),
}).strict()

// ── Teacher Schemas ────────────────────────────────────────────

const createTeacherSchema = z.object({
   name,
   email,
   phone,
   subject: z.string().max(v.subject.max, `Subject must be at most ${v.subject.max} characters`),
}).strict()

// ── Task Schemas ───────────────────────────────────────────────

const createTaskSchema = z.object({
   title: z.string().min(v.title.min, "Title is required").max(v.title.max),
   description: z.string().max(v.description.max).optional().default(""),
   subject: z.string().min(1, "Subject is required").max(v.subject.max),
   assignedTo: mongoId,
   dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "dueDate must be YYYY-MM-DD format").optional(),
   deadline: z.string().optional(),
   priority: z.enum(v.taskPriority).optional().default("medium"),
   xp: z.number().min(v.xp.min).max(v.xp.max).optional().default(10),
   status: z.enum(v.taskStatus).optional().default("pending"),
}).strict()

const createTaskAltSchema = z.object({
   title: z.string().min(v.title.min).max(v.title.max),
   subject: z.string().min(1).max(v.subject.max),
   xp: z.number().min(v.xp.min).max(v.xp.max),
   status: z.enum(v.taskStatus),
   assignedTo: mongoId,
   deadline: z.string().optional(),
}).strict()

const updateTaskStatusSchema = z.object({
   status: z.enum(v.taskStatus, { message: `Status must be one of: ${v.taskStatus.join(", ")}` }),
}).strict()

// ── Notification Schemas ───────────────────────────────────────

const createNotificationSchema = z.object({
   message: z.string().min(v.message.min).max(v.message.max),
   type: z.enum(["info", "success", "warning", "error"]),
   studentId: mongoId,
}).strict()

// ── Score Schemas ──────────────────────────────────────────────

const addScoreSchema = z.object({
   studentId: mongoId,
   subject: z.string().min(1).max(v.subject.max),
   score: z.number().min(v.score.min).max(v.score.max),
   instituteId: z.string().max(v.instituteId.max).optional(),
}).strict()

const deleteScoreSchema = z.object({
   subject: z.string().min(1).max(v.subject.max),
   studentId: mongoId,
   instituteId: z.string().max(v.instituteId.max).optional(),
}).strict()

// ── Aria Chat Schema ───────────────────────────────────────────

const ariaChatSchema = z.object({
   message: z.string().min(v.message.min, "Message is required").max(v.message.max, `Message must be at most ${v.message.max} characters`),
}).strict()

// ── Report Schema ──────────────────────────────────────────────

const createReportSchema = z.object({
   instituteId: mongoId,
   generatedBy: z.string().min(1).max(100),
   types: z.string().min(1).max(100),
   data: z.any(),
   generatedAt: z.string().optional(),
}).strict()

module.exports = {
   signupSchema,
   loginSchema,
   createStudentSchema,
   updateStudentSchema,
   createTeacherSchema,
   createTaskSchema,
   createTaskAltSchema,
   updateTaskStatusSchema,
   createNotificationSchema,
   addScoreSchema,
   deleteScoreSchema,
   ariaChatSchema,
   createReportSchema,
}
