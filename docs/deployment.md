# BioSentra AI - Deployment & Hosting Guide

This document outlines instructions for deploying BioSentra AI in production environments.

---

## 🚂 Option 1: Railway Deployment (Recommended)

Railway offers seamless database integration and Dockerfile builds.

### 1. Database Setup
1. Log in to **Railway.app** and click **New Project**.
2. Select **Provision PostgreSQL** from the database list.
3. Once the database container is active, copy its **Connection URL** (found under the variables tab as `DATABASE_URL`).

### 2. Backend API Deployment
1. Click **New Service** -> **GitHub Repo** and connect your BioSentra AI repository.
2. Under service settings, select the root directory `/` or `/backend`.
3. Add the following environment variables:
   *   `DATABASE_URL`: (Inject the database URL from the Provisioned PostgreSQL service)
   *   `SECRET_KEY`: (A secure cryptographic random string)
   *   `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`
4. Set the **Build Command** to:
   ```bash
   pip install -r backend/requirements.txt && python scripts/generate_datasets.py && python scripts/train_models.py
   ```
5. Set the **Start Command** to:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

### 3. Frontend Deployment
1. Click **New Service** -> **GitHub Repo** and link the same repo.
2. In the settings panel:
   *   Set the root directory to `/frontend`.
   *   Add variable `VITE_API_URL`: (Paste your Railway backend service URL, e.g., `https://biosentra-api.up.railway.app/api`).
3. Railway detects the `Dockerfile` in the frontend folder, running a multi-stage Nginx build automatically.

---

## ☁️ Option 2: Render Deployment

Render supports free-tier web hosting for both FastAPI services and React static sites.

### 1. Render PostgreSQL Database
1. Go to **Dashboard** -> **New** -> **PostgreSQL**.
2. Specify database name, user name, and select the free tier. Create the database.
3. Save the **Internal Database URL** for the backend configuration.

### 2. Render Web Service (FastAPI Backend)
1. Select **New** -> **Web Service** and link your repo.
2. Configure settings:
   *   **Runtime:** `Python`
   *   **Build Command:** `pip install -r backend/requirements.txt && python scripts/generate_datasets.py && python scripts/train_models.py`
   *   **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   *   `DATABASE_URL`: (Paste the database URL from step 1)
   *   `SECRET_KEY`: (Generate a secure key)

### 3. Render Static Site (React Frontend)
1. Select **New** -> **Static Site**.
2. Configure settings:
   *   **Build Command:** `npm install && npm run build`
   *   **Publish Directory:** `dist`
3. Add Environment Variables:
   *   `VITE_API_URL`: (URL of your backend Web Service + `/api`, e.g., `https://biosentra-backend.onrender.com/api`).

---

## 🖥️ Option 3: VPS Deployment (Ubuntu + Nginx)

For deployment on virtual private servers like DigitalOcean, Linode, or AWS EC2.

### 1. Nginx Host Configuration
Create a configuration file at `/etc/nginx/sites-available/biosentra` on your VPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Static Frontend Assets
    location / {
        root /var/www/biosentra/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to FastAPI
    location /api {
        proxy_pass http://127.0.0.1:8000/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/biosentra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemerctl reload nginx
```

### 2. Running FastAPI with Systemd
Create a service file at `/etc/systemd/system/biosentra.service`:

```ini
[Unit]
Description=BioSentra FastAPI service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/biosentra
Environment="DATABASE_URL=postgresql://postgres:password@localhost/biosentra"
Environment="SECRET_KEY=yoursecretkey"
ExecStart=/var/www/biosentra/venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable biosentra
sudo systemctl start biosentra
```
