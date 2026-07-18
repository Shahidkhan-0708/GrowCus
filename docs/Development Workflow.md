# Development Workflow

This document explains how to set up the Growcus environment, run the servers, and contribute to the codebase.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or via MongoDB Atlas)
- Redis (optional, but recommended for caching functionality)
- Groq API Key (for the Aria AI assistant)

## 1. Environment Setup

1. **Clone the repository.**
2. **Install Backend Dependencies**:
   ```bash
   cd task/Growcus
   npm install
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
4. **Create Environment Files**:
   - In the root backend directory, copy `.env example` to `.env` and fill in the required values (see [[Environment Variables]]).
   - In the `frontend/` directory, create a `.env.local` containing `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

## 2. Running the Project Locally

To run the full stack, you need two terminals.

### Terminal 1: Backend
```bash
cd task/Growcus
npm run dev
```
*(Uses `nodemon` to automatically restart the server upon file changes).*

### Terminal 2: Frontend
```bash
cd task/Growcus/frontend
npm run dev
```
*(Starts the Next.js development server on port 3000).*

## 3. Database Seeding

If starting from a fresh database, you can populate it with mock students, teachers, and tasks using the seeder script.
```bash
node seed.js
```
*Warning: This script drops existing collections. Do not run in production.*

## 4. Making Changes (Best Practices)

- **Controllers vs Services**: When adding new functionality, put HTTP request parsing and response formatting in the `controllers/`. Put heavy business logic, calculations, and DB aggregations in `services/`.
- **Validation**: If you add a new endpoint that accepts a POST/PUT body, you **must** create a Zod schema in `middlewares/schemas.js` and use the `validate` middleware.
- **Error Handling**: Wrap all async controller functions in `asyncHandler`. Never use raw `try/catch` blocks unless you are handling a very specific local fallback. Throw `AppError` for operational errors.

---

**Related:**
- [[Architecture]]
- [[Error Handling]]
