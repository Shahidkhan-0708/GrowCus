# Growcus

Growcus is a full-stack student growth and coaching management platform built for institutes, teachers, and students. The idea behind Growcus is simple: coaching centers should not only manage students, but also understand their progress, detect academic risk early, assign meaningful work, and keep students motivated with a cleaner digital system.

This project was built as a complete web application with a separate backend API and a modern dashboard frontend. It includes authentication, role-based data access, student and teacher management, task tracking, progress analytics, risk calculation, notifications, and an AI assistant called Aria for academic guidance.

## Why I Built This

Growcus was created to solve a real education-management problem. In many coaching institutes, student performance is tracked manually or across disconnected tools. Teachers may know that a student is struggling, but they often do not have one place to see attendance, marks, pending tasks, progress, and risk indicators together.

Growcus brings these ideas into one platform:

- Admins can view institute-level performance.
- Teachers can manage students, assign tasks, and track risk.
- Students can see their tasks, progress, XP, and learning journey.
- The system can calculate risk based on measurable academic signals.
- Aria, the AI assistant, can motivate students and guide them when they need help.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui style component structure
- Radix UI primitives
- Recharts for dashboard-style visualizations
- Lucide React icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Cookie-based auth flow
- Express middleware
- Redis caching support
- Groq SDK for the Aria AI assistant

## Main Features

### Authentication and User Roles

Growcus supports role-based users such as admin, teacher, and student. The backend uses bcrypt to hash passwords before storing them in MongoDB. After login or signup, the server creates a JWT token and stores it in an HTTP-only cookie.

This is an important security concept because the frontend does not need to manually store the token in localStorage. The cookie is sent with requests, and protected routes verify the token before allowing access.

### Role-Based Dashboard

The dashboard changes according to the user role:

- Students see personal progress, XP, attendance, and pending tasks.
- Teachers see student lists, risk indicators, and task status.
- Admins see higher-level institute statistics, active teachers, reports, and student activity.

This required designing both the backend data queries and frontend UI so that the same application can serve different types of users.

### Student and Teacher Management

Admins and teachers can create and manage students. Admins can also create teachers. The backend stores users in a common `User` model and separates behavior using the `role` field.

This approach keeps the database simpler while still allowing different permissions and dashboard experiences.

### Task Assignment System

Teachers or admins can create tasks for students with:

- Title
- Description
- Subject
- Priority
- Deadline
- XP value
- Status
- Assigned student
- Assigning teacher/admin

Tasks are connected to users using MongoDB ObjectId references. This makes it possible to query tasks by student, populate user data, and calculate progress from task completion.

### Progress Tracking

Growcus calculates student progress from task completion. It groups tasks by subject and calculates completion percentages. This helps students and teachers understand where work is being completed and where attention is still needed.

The progress system uses backend aggregation-style logic and frontend dashboard rendering to convert raw database records into useful learning insights.

### Risk Score Calculation

One of the harder concepts in Growcus is academic risk detection. The backend checks different student signals such as:

- Task completion rate
- Attendance
- Marks

If a student has low task completion, low attendance, or low marks, the system adds those as risk factors. Based on the number of risk factors, the student receives a risk level such as low, medium, high, or critical.

This feature is important because it turns normal data into decision-making data. Instead of only storing marks and attendance, the system tries to identify which students may need support.

### Analytics

Growcus includes analytics routes for institute-level insights. For example, it can count students, count active teachers, and calculate average subject scores from score records.

Some analytics data also uses Redis caching support. Caching is useful because analytics queries can become expensive as data grows. Redis can temporarily store calculated results so the server does not need to repeatedly query MongoDB for the same information.

### Notifications

The notification system allows messages to be created for students and tracked as read or unread. Notifications are stored in MongoDB and connected to both the sender and student.

This feature introduced concepts like:

- User-specific queries
- Read/unread state
- Sorting by newest activity
- Different behavior for student and teacher roles

### Aria AI Assistant

Aria is an AI coaching assistant built using the Groq SDK. It is designed to help JEE/NEET students stay motivated, understand weak subjects, and remain on track.

The backend sends a system prompt that defines Aria's behavior, then forwards the student's message to the AI model. The response is returned to the frontend as a chat reply.

This feature combines API integration, environment variables, async backend handling, and AI prompt design.

## Harder Concepts Used In This Project

### 1. Full-Stack Architecture

Growcus is not only a frontend or backend project. It uses a separate frontend and backend:

- The frontend handles the user interface and dashboard experience.
- The backend handles API routes, authentication, database operations, and business logic.
- MongoDB stores persistent data.
- Cookies connect the logged-in browser session to protected backend routes.

This structure is closer to how real production applications are built.

### 2. MVC-Like Backend Organization

The backend is split into folders such as:

- `models` for database schemas
- `controllers` for request logic
- `routes` for API endpoints
- `middlewares` for reusable request checks
- `services` for helper logic

This separation makes the project easier to understand and scale. Instead of putting all code inside one server file, each part has a responsibility.

### 3. JWT Authentication

JWT authentication is used to identify logged-in users. The token stores important user information such as:

- User ID
- Role
- Institute ID

Protected routes use middleware to verify the token before allowing access. This allows the backend to know who is making the request and what data they should be allowed to access.

### 4. Password Hashing

Passwords are never stored directly. Growcus uses bcrypt to hash passwords before saving them. During login, bcrypt compares the entered password with the stored hash.

This is a core security practice in real applications.

### 5. MongoDB Relationships With Mongoose

Growcus uses Mongoose schemas and ObjectId references to connect data. For example:

- A task is assigned to a user.
- A risk score belongs to a student.
- A notification belongs to a student and sender.

These relationships make it possible to build meaningful dashboards from connected collections.

### 6. Role-Based Data Filtering

Different users should not always see the same data. A student should mainly see their own tasks and progress. A teacher should see assigned students. An admin can see broader institute data.

This required writing backend logic that checks the logged-in user's role and returns the correct data.

### 7. Aggregation and Derived Data

The dashboard does not only display stored values. It calculates useful derived data such as:

- Task completion percentage
- Average attendance
- At-risk student count
- Subject progress
- Teacher student counts
- Average score by subject

This is one of the biggest differences between a simple CRUD app and a real dashboard app.

### 8. API Integration

Aria uses an external AI API through the Groq SDK. This required handling:

- API keys through environment variables
- Async API calls
- Error handling
- Prompt design
- Returning AI-generated responses to the frontend

### 9. Caching With Redis

Redis support is included for analytics caching. Caching helps improve performance by temporarily storing computed results. This is useful when analytics data does not need to be recalculated on every request.

### 10. Frontend State and API Handling

The frontend uses reusable API helper logic to call the backend with credentials included. Dashboard pages manage loading states, error handling, role-based UI, and dynamic data rendering.

This makes the frontend behave like a real application instead of a static website.

## Project Structure

```txt
Growcus/
|-- app.js
|-- db/
|   `-- db.js
|-- controllers/
|   |-- auth.js
|   |-- data.js
|   |-- risk.js
|   |-- task.js
|   |-- student.js
|   `-- notification.js
|-- routes/
|   |-- auth.js
|   |-- data.js
|   |-- analytics.js
|   |-- risk.js
|   `-- task.js
|-- models/
|   |-- User.js
|   |-- Tasks.js
|   |-- Riskscore.js
|   |-- Notification.js
|   |-- Score.js
|   `-- Report.js
|-- middlewares/
|   `-- auth.js
|-- services/
|   |-- auth.js
|   |-- taskData.js
|   |-- studentData.js
|   `-- aria.js
`-- frontend/
    |-- app/
    |-- components/
    |-- contexts/
    |-- hooks/
    `-- lib/
```

## API Overview

Some important backend routes include:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Log in and receive auth cookie |
| `GET` | `/api/me` | Get current logged-in user |
| `GET` | `/api/dashboard` | Get dashboard data |
| `GET` | `/api/students` | Get students based on user role |
| `POST` | `/api/students` | Create a student |
| `GET` | `/api/teachers` | Get teachers |
| `POST` | `/api/teachers` | Create a teacher |
| `GET` | `/api/tasks` | Get tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id/status` | Update task status |
| `GET` | `/api/progress` | Get student progress |
| `GET` | `/api/risk` | Get risk-related student data |
| `POST` | `/aria/message-aria` or `/api/aria/message-aria` | Chat with Aria AI assistant |

## Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Create a `.env.local` file inside the `frontend` folder if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## How To Run Locally

### 1. Install backend dependencies

```bash
npm install
```

### 2. Start the backend

```bash
npm start
```

The backend runs on:

```txt
http://localhost:5000
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The frontend usually runs on:

```txt
http://localhost:3000
```

## What I Learned While Building Growcus

Building Growcus helped me understand how real full-stack applications are structured. Some of the biggest learning areas were:

- Connecting frontend pages to backend APIs
- Designing MongoDB schemas
- Protecting routes with authentication middleware
- Hashing passwords securely
- Working with cookies and JWT tokens
- Creating role-based dashboards
- Calculating progress and risk from raw data
- Building reusable services and controllers
- Handling async errors in backend routes
- Integrating an AI assistant into an application
- Thinking about performance using indexes and Redis caching

This project also taught me how much planning is needed when a website grows from simple pages into a real product.

## Future Improvements

Some improvements that can make Growcus even stronger:

- Add stronger input validation with Zod or Joi on the backend.
- Move JWT secret into environment variables.
- Add automated tests for auth, task creation, and risk calculation.
- Improve role permissions for every route.
- Add report generation with downloadable PDFs.
- Add better Redis caching for dashboard analytics.
- Add deployment configuration for production hosting.
- Improve notification delivery through email or WhatsApp.
- Add admin controls for institutes, batches, and subjects.

## About The Project

Growcus is a self-built full-stack project focused on education technology, student performance tracking, and coaching institute management. It represents my learning journey in web development and my attempt to build something larger than a normal practice project.

The goal was not only to make pages look good, but to understand how a real product works from frontend to backend: users, roles, database models, protected APIs, dashboard data, analytics, AI integration, and performance thinking.
