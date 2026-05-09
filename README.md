# Growcus

AI-powered student growth and coaching management platform built using modern full-stack architecture.

Growcus helps institutes, teachers, and students track academic performance, assign tasks, monitor risk levels, and improve learning workflows through analytics and AI assistance.

---

# 🚀 Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Redis Caching
* Rate Limiting
* Docker
* Groq SDK

---

# 🏗 System Architecture

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
                          │ REST API
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

# 🔐 Authentication Flow

```text
User Login
    ↓
Backend validates credentials
    ↓
bcrypt compares password hash
    ↓
JWT token generated
    ↓
HTTP-only cookie stored
    ↓
Protected middleware verifies JWT
    ↓
Authorized dashboard access
```

---

# 📊 Risk Detection Flow

```text
Attendance + Marks + Task Completion
                  ↓
           Risk Calculation Engine
                  ↓
     Low / Medium / High / Critical
```

The system converts raw academic data into actionable risk indicators to help teachers identify struggling students early.

---

# 🤖 Aria AI Assistant Flow

```text
Student Prompt
      ↓
Frontend Chat UI
      ↓
Express API Route
      ↓
Aria Service Layer
      ↓
Groq API
      ↓
AI Response Returned
```

Aria helps students with motivation, academic guidance, and subject-level assistance.

---

# ✨ Core Features

* Role-based dashboards
* JWT authentication
* Secure cookie-based auth
* Task assignment system
* Student progress tracking
* Academic risk analysis
* Notifications system
* Analytics dashboard
* AI-powered assistant
* Redis caching
* API rate limiting
* Dockerized deployment

---

# 🧠 Backend Architecture

Growcus follows an MVC-inspired backend structure:

```text
routes → controllers → services → models → database
```

This separation improves maintainability, scalability, and cleaner backend organization.

---

# ⚡ Request Lifecycle

```text
Client Request
      ↓
Route Layer
      ↓
Auth Middleware
      ↓
Controller
      ↓
Service Layer
      ↓
Database / Cache / AI API
      ↓
JSON Response
```

---

# 📁 Project Structure

```text
Growcus/
│
├── controllers/
├── routes/
├── models/
├── middlewares/
├── services/
├── frontend/
├── db/
├── docker/
└── config/
```

---

# 📡 Important API Routes

| Method | Route                  | Purpose           |
| ------ | ---------------------- | ----------------- |
| POST   | /auth/signup           | Register user     |
| POST   | /auth/login            | Login user        |
| GET    | /api/dashboard         | Dashboard data    |
| GET    | /api/tasks             | Fetch tasks       |
| POST   | /api/tasks             | Create task       |
| GET    | /api/risk              | Student risk data |
| POST   | /api/aria/message-aria | AI assistant chat |

---

# ⚙️ Environment Variables

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---

# 🐳 Docker Support

Growcus supports containerized deployment using Docker.

```bash
docker build -t growcus .
docker run -p 5000:5000 growcus
```

This improves deployment consistency and environment portability.

---

# 🧪 Running Locally

## Backend

```bash
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 📚 What I Learned

Building Growcus helped me understand:

* Full-stack architecture
* JWT authentication
* Secure password hashing
* Role-based access control
* MongoDB relationships
* REST API design
* Redis caching
* Dockerized deployment
* Rate limiting concepts
* AI API integration
* Dashboard analytics
* Backend scalability thinking

---

# 🔮 Future Improvements

* Automated testing
* Queue-based notifications
* Better analytics caching
* Monitoring & logging
* CI/CD pipeline integration
* Horizontal scaling improvements
* WebSocket-based realtime notifications

---

# 📌 About The Project

Growcus is a self-built education technology platform focused on combining backend engineering, analytics, AI workflows, and scalable architecture into one system.

The goal was not only to build pages and APIs, but to understand how real production-style applications are structured internally.
