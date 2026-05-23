# Growcus

Growcus is a full-stack student growth and coaching management platform built for institutes, teachers, and students. The idea behind Growcus is simple: coaching centers should not only manage students, but also understand their progress, detect academic risk early, assign meaningful work, and keep students motivated with a cleaner digital system.

This project was built as a complete web application with a separate backend API and a modern dashboard frontend. It includes authentication, role-based data access, student and teacher management, task tracking, progress analytics, risk calculation, notifications, and an AI assistant called Aria for academic guidance.

---

## 🎯 Why I Built This

Growcus was created to solve a real education-management problem. In many coaching institutes, student performance is tracked manually or across disconnected tools. Teachers may know that a student is struggling, but they often do not have one place to see attendance, marks, pending tasks, progress, and risk indicators together.

Growcus brings these ideas into one platform:
* **Admins** can view institute-level performance and manage teachers.
* **Teachers** can manage students, assign tasks, and track academic risk.
* **Students** can see their tasks, progress, XP, and learning journey.
* **Risk Engine** calculates academic risk based on measurable signals (attendance, scores, tasks).
* **Aria (AI)** motivates students and guides them when they need subject-level help.

---

## 🚀 Tech Stack

### Frontend
* **Next.js** / **React** / **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** style component structure & Radix UI primitives
* **Recharts** for dashboard-style data visualizations
* **Lucide React** icons

### Backend
* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** (ODM)
* **JWT Authentication** (Secure HTTP-Only Cookie-based auth flow)
* **bcrypt** for secure password hashing
* **Redis Caching** for caching dashboard statistics
* **Groq SDK** for Aria AI Assistant integration
* **Rate Limiting** for API security
* **Docker** for containerized deployments

---

## 🏗 System Architecture

```text
                ┌────────────────────┐
                │       Users        │
                │ Admin / Teacher /  │
                │      Student       │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │  Next.js Frontend  │
                │ Dashboard + UI     │
                └─────────┬──────────┘
                          │ REST API (Credentials/Cookies)
                          ▼
                ┌────────────────────┐
                │ Express Backend    │
                │ API Layer          │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐ ┌────────────────┐ ┌────────────────┐
│ Auth Layer   │ │ Business Logic │ │ AI Integration │
│ JWT + Cookie │ │ Services       │ │ Groq SDK       │
└──────┬───────┘ └────────┬───────┘ └────────┬───────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────────────────────────────────────────┐
│                  MongoDB Database                │
└──────────────────────────────────────────────────┘

            Performance & Infrastructure Layer

      ┌────────────────┐     ┌────────────────┐
      │  Redis Cache   │     │  Rate Limiter  │
      └────────────────┘     └────────────────┘

                    Containerized Using Docker
```

---

## 🔐 Authentication Flow

```text
User Login / Signup
        ↓
Backend validates credentials
        ↓
bcrypt hashes/compares password
        ↓
JWT token generated (User ID, Role, etc.)
        ↓
HTTP-only cookie stored in browser
        ↓
Protected middleware verifies JWT on requests
        ↓
Authorized dashboard/API access
```

---

## 📊 Risk Detection Flow

```text
Attendance + Marks + Task Completion
                  ↓
           Risk Calculation Engine
                  ↓
     Low / Medium / High / Critical
```

The system converts raw academic data into actionable risk indicators to help teachers identify struggling students early.

---

## 🤖 Aria AI Assistant Flow

```text
Student Prompt
      ↓
Frontend Chat UI
      ↓
Express API Route
      ↓
Aria Service Layer
      ↓
Groq API (Llama/Mixtral model)
      ↓
AI Response Returned
```

Aria helps students with motivation, academic guidance, and subject-level assistance.

---

## ✨ Core Features

* **Role-Based dashboards:** Tailored dashboards for Admin, Teacher, and Student.
* **Secure Cookie-Based Auth:** JWT tokens stored securely in HTTP-only cookies (protecting against XSS).
* **Task Assignment System:** Full CRUD for assigning tasks with priorities, deadlines, and XP values.
* **Student Progress Tracking:** Derived completion rates grouped by subject.
* **Academic Risk Analysis:** Engine that aggregates performance data to label student risk levels.
* **Analytics Dashboard:** Visual charts using Recharts for comprehensive progress monitoring.
* **AI-powered Assistant:** Chat integration with Groq to guide students.
* **Redis Caching:** Caching for expensive MongoDB aggregation queries.
* **API Rate Limiting:** Prevents abuse of sensitive endpoints.
* **Dockerized Deployment:** Complete Docker and Docker Compose setup.

---

## 🧠 Backend Architecture & Request Lifecycle

Growcus follows an MVC-inspired backend structure:
`routes` ➔ `middlewares` ➔ `controllers` ➔ `services` ➔ `models` ➔ `database`

### Request Lifecycle
```text
Client Request
      ↓
Route Layer
      ↓
Auth Middleware (JWT cookie validation & Role checks)
      ↓
Controller (Request validation & Response formatting)
      ↓
Service Layer (Business logic, calculations)
      ↓
Database / Cache / AI API (MongoDB, Redis, Groq)
      ↓
JSON Response
```

---

## 📁 Project Structure

```txt
Growcus/
│-- app.js                    # Express application entrypoint
│-- db/
│   `-- db.js                 # MongoDB database connection helper
│-- controllers/              # Request handlers
│   |-- auth.js
│   |-- data.js
│   |-- risk.js
│   |-- task.js
│   |-- student.js
│   `-- notification.js
│-- routes/                   # API routes
│   |-- auth.js
│   |-- data.js
│   |-- analytics.js
│   |-- risk.js
│   `-- task.js
│-- models/                   # Mongoose schemas
│   |-- User.js
│   |-- Tasks.js
│   |-- Riskscore.js
│   |-- Notification.js
│   |-- Score.js
│   `-- Report.js
│-- middlewares/              # Express middlewares (auth, logging, roles)
│   `-- auth.js
│-- services/                 # External APIs and business logic helpers
│   |-- auth.js
│   |-- taskData.js
│   |-- studentData.js
│   `-- aria.js
`-- frontend/                 # Next.js frontend application
    |-- app/                  # App Router pages and layouts
    |-- components/           # Shared UI components
    |-- contexts/             # Global contexts (Auth, Theme)
    |-- hooks/                # Custom React hooks
    `-- lib/                  # Helper utilities (API client, constants)
```

---

## 📡 Important API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Log in and receive auth cookie |
| `GET` | `/api/me` | Get current logged-in user |
| `GET` | `/api/dashboard` | Get dashboard data (with caching) |
| `GET` | `/api/students` | Get students based on user role |
| `POST` | `/api/students` | Create a student record |
| `GET` | `/api/teachers` | Get list of teachers (Admin only) |
| `POST` | `/api/teachers` | Create a teacher record |
| `GET` | `/api/tasks` | Fetch tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id/status` | Update task completion status |
| `GET` | `/api/progress` | Get student progress calculations |
| `GET` | `/api/risk` | Get student academic risk levels |
| `POST` | `/api/aria/message-aria` | Send prompt to Aria AI assistant |

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🐳 Docker Support

Growcus supports containerized deployment using Docker.

```bash
# Build the Docker image
docker build -t growcus .

# Run the container
docker run -p 5000:5000 growcus
```

---

## 🧪 Running Locally

### 1. Run the Backend

```bash
# Install backend dependencies
npm install

# Start the backend server
npm start
```
The backend server runs at `http://localhost:5000`.

### 2. Run the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```
The frontend application runs at `http://localhost:3000`.

---

## 📚 What I Learned While Building Growcus

Building Growcus helped me understand how production-grade full-stack applications are structured. Some of the major learning highlights include:

* **Connecting Frontend & Backend:** Establishing clean communication between Next.js pages/layouts and an Express API.
* **Role-Based Access Control (RBAC):** Designing permissions and conditional UI rendering based on User Roles (Admin, Teacher, Student) and applying corresponding route protection.
* **Secure Cookie-Based Sessions:** Avoiding localStorage for JWT storage to prevent XSS attacks and configuring secure HTTP-only cookies.
* **Advanced Mongoose Relationships:** Using mongoose object references (`ref`), populate fields, and building derived aggregates.
* **Derived Data and Analytics:** Calculating metrics on the fly (risk metrics, attendance average, subject progress rates) instead of storing hardcoded statistics.
* **Redis Caching:** Accelerating database analytics queries and minimizing MongoDB load by utilizing Redis key-value stores.
* **AI Integration:** Constructing system prompts and using Groq API streaming or responses to build a conversational assistant.
* **Docker Containerization:** Preparing applications for clean, reproducible production environments.

---

## 🔮 Future Improvements

* **Zod Validation:** Adding stronger runtime input validation with Zod or Joi schemas on the backend.
* **WebSocket Integration:** Implementing realtime push notifications for task assignments and risk warnings.
* **Advanced Queueing:** Setting up BullMQ or RabbitMQ for handling notification emails/SMS in background jobs.
* **Automated Testing:** Writing unit and integration tests using Jest and Supertest.
* **PDF Report Generation:** Allowing admins and teachers to download printable PDF progress reports.
* **CI/CD Pipeline:** Setting up GitHub Actions to automate linting, tests, and deployments.

---

## 📌 About The Project

Growcus is a self-built full-stack ed-tech platform combining backend engineering, data analytics, AI integration, and modern caching architectures. It represents my learning journey in web development and my attempt to build a comprehensive, production-style product.
