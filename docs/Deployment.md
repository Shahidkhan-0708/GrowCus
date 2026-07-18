# Deployment

This document covers how to deploy the Growcus backend to a production environment.

## Prerequisites
- A virtual private server (VPS) or PaaS (like Heroku, Render, or Railway).
- Node.js installed on the server.
- A managed MongoDB instance (e.g., MongoDB Atlas).
- A managed Redis instance (e.g., Upstash or Redis Cloud).

## 1. Preparing for Production

1. **Environment Variables**:
   - Create a `.env` file on the production server.
   - **Critical**: Set `NODE_ENV=production`. This enables strict error masking in `error.js` and enforces `JWT_SECRET` presence in `security.js`.
   - Set a strong, randomly generated `JWT_SECRET`.
   - Update `MONGO_URL` to point to the production database cluster.

2. **Security Checks**:
   - Ensure rate limiting environment variables (`RL_AUTH_MAX`, `RL_API_MAX`) are set appropriately for your expected traffic.

## 2. Process Management (PM2)

In production, you should never use `npm start` or `node app.js` directly, as the process will die if it crashes and won't restart on server reboots. Instead, use a process manager like **PM2**.

### Installation
```bash
npm install -g pm2
```

### Starting the Application
```bash
pm2 start app.js --name "growcus-api"
```

### Useful PM2 Commands
- `pm2 logs growcus-api` (View logs)
- `pm2 restart growcus-api` (Restart server)
- `pm2 startup` (Configure PM2 to start on server boot)

## 3. Reverse Proxy (Nginx)

Expose the Node.js app to the internet securely using Nginx as a reverse proxy.

1. **Install Nginx**.
2. **Configure Domain**: Create a block in `/etc/nginx/sites-available/growcus` to route traffic from port 80/443 to port `5000`.
3. **SSL (HTTPS)**: Use Certbot (Let's Encrypt) to secure the API. The `JWT` cookies/headers are vulnerable to interception over plain HTTP.

## 4. Scaling

Growcus is designed to be horizontally scalable:
- Because JWTs are stateless, you can run multiple instances of the API behind a load balancer without configuring "sticky sessions."
- Redis handles cross-instance caching seamlessly.

---

**Related:**
- [[Environment Variables]]
- [[Security]]
- [[Architecture]]
