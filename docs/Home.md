# Growcus Knowledge Base

Welcome to the **Growcus** project documentation. This knowledge base is designed for onboarding new developers, extending the system, and serving as a long-term reference.

## Project Overview

Growcus is an AI-powered student growth and academic intelligence platform. It provides an interactive dashboard for educational institutes, allowing teachers and admins to track student progress, manage tasks, and calculate automated risk scores based on academic performance, attendance, and task completion. The platform also features an AI assistant (Aria) to support students with academic queries and motivation.

## Core Pillars

- **[[Architecture]]**: A layered, Node.js + Express backend paired with a Next.js frontend, utilizing MongoDB for data storage and Redis for caching.
- **[[Database]]**: Comprehensive modeling of users (students/teachers), tasks, performance scores, notifications, and system reports.
- **[[Authentication]]**: JWT-based authentication with role-based access control (Admin, Teacher, Student).
- **[[API]]**: RESTful endpoints protected by strict Zod validation schemas and tiered rate limiting.
- **[[Features/AI Integration|AI Integration]]**: Llama-3 based coaching assistant powered by Groq SDK.

## Getting Started

If you are a new developer, we recommend reading the documentation in the following order:

1. **[[Development Workflow]]**: Learn how to set up the environment, install dependencies, and run the project locally.
2. **[[Environment Variables]]**: Understand the required configuration for local and production setups.
3. **[[Folder Structure]]**: Get a bird's eye view of where everything lives.
4. **[[Request Flow]]**: Trace how an HTTP request enters the system, gets validated, processed, and returned.

## System Internals

Deep dive into how the system handles critical concerns:

- **[[Security]]**: How we mitigate attacks (Helmet, HPP, Rate Limiting, Zod Validation).
- **[[Error Handling]]**: Our unified error management and normalized client responses.
- **[[Logging]]**: How requests and operational events are tracked.
- **[[Caching]]**: Redis implementation for analytics and heavy queries.
- **[[Dependencies]]**: Key packages that power Growcus.

## Domain Documentation

Explore specific architectural layers:
- [[Controllers/Overview|Controllers]]
- [[Routes/Overview|Routes]]
- [[Models/Overview|Models]]
- [[Services/Overview|Services]]
- [[Middleware/Overview|Middleware]]
- [[Features/Overview|Features]]

---

> [!TIP]
> Use the Obsidian search feature or follow the wiki-links to navigate through this knowledge base. All documentation aims to reflect the *current* state of the codebase, without assuming undocumented features.
