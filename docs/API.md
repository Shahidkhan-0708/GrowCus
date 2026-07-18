# API Reference

The Growcus backend exposes a RESTful JSON API. Below is a structured discovery of the available endpoints.

*Note: All endpoints are prefixed with the base URL (e.g., `http://localhost:5000`).*

## Authentication Routes (`/auth`)
*Rate limited by `authLimiter`.*

### `POST /auth/signup`
- **Purpose**: Register a new user (Admin, Teacher, or Student).
- **Auth Required**: No.
- **Middleware**: `validate(signupSchema)`
- **Request Body**: `name`, `email`, `password`, `role`, `instituteId`
- **Response**: JWT Token + User Object
- **Errors**: 400 Validation Error, 400 User Already Exists.

### `POST /auth/login`
- **Purpose**: Authenticate an existing user.
- **Auth Required**: No.
- **Middleware**: `validate(loginSchema)`
- **Request Body**: `email`, `password`
- **Response**: JWT Token + User Object
- **Errors**: 401 Invalid Credentials.

---

## Data / Dashboard Routes (`/api/data`)
*Rate limited by `apiLimiter`. Auth required.*

### `GET /api/data/dashboard-aggregate`
- **Purpose**: Fetch high-level statistics for the institute (total tasks, students, avg score).
- **Auth Required**: Yes (`requireAuth`).
- **Response**: DashboardStat Object.

### `GET /api/data/students`
- **Purpose**: Get a list of all students for the institute.
- **Auth Required**: Yes.
- **Response**: Array of User (Student) objects with populated Task/Score stats.

### `GET /api/data/students/:id`
- **Purpose**: Get deep details for a single student.
- **Auth Required**: Yes.
- **Middleware**: `validateObjectId`
- **Response**: Student Object + Tasks + Scores + Risk Level.

---

## Task Management (`/api/tasks`)

### `POST /api/tasks`
- **Purpose**: Create a new task and assign it to a student.
- **Auth Required**: Yes.
- **Role Required**: `admin`, `teacher`
- **Middleware**: `validate(createTaskSchema)`
- **Request Body**: `title`, `description`, `subject`, `assignedTo`, `priority`, `xp`

### `PATCH /api/tasks/:id/status`
- **Purpose**: Update a task's status (e.g., pending to completed).
- **Auth Required**: Yes.
- **Middleware**: `validateObjectId`, `validate(updateTaskStatusSchema)`
- **Request Body**: `status`
- **DB Operations**: Updates the `Tasks` document and recalculates the student's XP if marked completed.

---

## Risk & Analytics (`/api/risk`)

### `GET /api/risk/distribution`
- **Purpose**: Fetch risk distributions (low, medium, high) across the institute.
- **Auth Required**: Yes.
- **Service**: Uses `studentData.js` helper.

---

## AI Assistant (`/aria`)
*Rate limited by `ariaLimiter`.*

### `POST /aria/chat`
- **Purpose**: Communicate with the Aria Llama-3 AI.
- **Auth Required**: Yes.
- **Middleware**: `validate(ariaChatSchema)`
- **Request Body**: `message` (string).
- **Response**: AI string response.

---

> [!NOTE]
> This is a curated list of primary endpoints. For full technical details, consult the exact router files in the `routes/` directory (e.g., `routes/student.js`, `routes/score.js`).
