# Features Overview

Growcus is a modular platform built around several distinct functional domains. This directory documents the complete business logic, user flow, and underlying code for each major feature.

## Feature Map

1. **[[Features/Authentication|Authentication & RBAC]]**: How users log in, sign up, and access secured resources.
2. **[[Features/Dashboard|Analytics Dashboard]]**: The high-level aggregation engine powering the teacher/admin view.
3. **[[Features/Task Management|Task Management]]**: How academic assignments are created, tracked, and completed for XP.
4. **[[Features/AI Assistant|Aria AI Assistant]]**: The Llama-3 powered student chatbot.
5. **[[Features/Risk Management|Risk Management (WIP)]]**: How the system identifies at-risk students using automated algorithms.

---

> [!NOTE]
> When modifying a feature, ensure you trace the execution flow starting from its corresponding [[Routes/Overview|Route]], through the [[Middleware/Overview|Middleware]], into the [[Controllers/Overview|Controller]], and down to the [[Models/Overview|Database Model]].
