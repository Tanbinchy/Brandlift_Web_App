# 🚀 BrandLift – Full-Stack Digital Marketing Agency Web App

## Project Structure

```
brandlift/
├── backend/              ← Node.js + Express + MongoDB API
│   ├── models/           ← Mongoose schemas
│   ├── routes/           ← REST API endpoints
│   ├── middleware/       ← JWT auth middleware
│   ├── controllers/      ← CRUD factory
│   ├── server.js         ← Entry point
│   ├── seed.js           ← Database seed with sample data
│   ├── .env.example      ← Environment variable template
│   └── package.json
└── frontend/             ← React + Vite app
    ├── src/
    │   ├── pages/
    │   │   ├── public/   ← Home, Services, Portfolio, Blog, Pricing, Contact
    │   │   └── admin/    ← Dashboard, all CRUD pages, Settings
    │   ├── components/   ← Navbar, Footer
    │   ├── context/      ← Auth context (JWT)
    │   └── utils/        ← Axios API client
    ├── .env.example
    └── package.json
```

---

## ✅ Step 1 — MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and log in
2. Create a free **M0** cluster (choose a region close to Bangladesh, e.g. Singapore)
3. Click **Database Access** → Add new user → set username & password → role: **Atlas Admin**
4. Click **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Connect** on your cluster → **Connect your application** → copy the URI

Your URI looks like:

```
mongodb+srv://youruser:yourpassword@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

---

## ✅ Step 2 — Backend Setup

```bash
# Navigate to backend folder
cd brandlift/backend

# Install dependencies
npm install

# Create your .env file (copy from example)
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/brandlift?retryWrites=true&w=majority
JWT_SECRET=pick_any_long_random_string_min_32_characters_here
JWT_EXPIRES_IN=7d
ADMIN_SETUP_KEY=brandlift_admin_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **JWT_SECRET** — type any long random string, e.g. `xK9#mP2$qL7nR4sT8vW1yZ6aB3cD5eF0`

---

## ✅ Step 4 — Start the Backend

```bash
# Development (auto-restarts on file changes)
npm run dev

# OR production
npm start
```

You should see:

```
✅ MongoDB connected
🚀 Server running on port 5000
```

Test it: Open [http://localhost:5000/api/health](http://localhost:5000/api/health) → should return `{ "status": "ok" }`

---

## ✅ Step 5 — Frontend Setup

Open a **new terminal**:

```bash
cd brandlift/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

The default `.env` for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Step 6 — Start the Frontend

```bash
npm run dev
```

You will see:

```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

---

## 🌐 Pages & URLs

### Public Website

| Page      | URL                    |
| --------- | ---------------------- |
| Home      | http://localhost:5173/ |
| Services  | /services              |
| Portfolio | /portfolio             |
| Blog      | /blog                  |
| Blog Post | /blog/:slug            |
| Pricing   | /pricing               |
| Contact   | /contact               |

### Admin Dashboard

| Page         | URL                               |
| ------------ | --------------------------------- |
| Login        | http://localhost:5173/admin/login |
| Dashboard    | /admin                            |
| Services     | /admin/services                   |
| Portfolio    | /admin/portfolio                  |
| Team         | /admin/team                       |
| Testimonials | /admin/testimonials               |
| Blog         | /admin/blog                       |
| Pricing      | /admin/pricing                    |
| Contacts     | /admin/contacts                   |
| Settings     | /admin/settings                   |

---

## 🔌 API Endpoints Reference

### Auth

| Method | Endpoint                  | Access                  |
| ------ | ------------------------- | ----------------------- |
| POST   | /api/auth/setup           | Public (with setup key) |
| POST   | /api/auth/login           | Public                  |
| GET    | /api/auth/me              | Admin                   |
| PUT    | /api/auth/change-password | Admin                   |

### All Resources (Services, Portfolio, Team, Testimonials, Blog, Pricing)

| Method | Endpoint           | Access |
| ------ | ------------------ | ------ |
| GET    | /api/:resource     | Public |
| GET    | /api/:resource/:id | Public |
| POST   | /api/:resource     | Admin  |
| PUT    | /api/:resource/:id | Admin  |
| DELETE | /api/:resource/:id | Admin  |

### Special Endpoints

| Method | Endpoint             | Access                   |
| ------ | -------------------- | ------------------------ |
| GET    | /api/blog/slug/:slug | Public                   |
| GET    | /api/blog/admin/all  | Admin                    |
| POST   | /api/contacts        | Public (form submission) |
| GET    | /api/contacts        | Admin                    |
| PUT    | /api/contacts/:id    | Admin                    |
| GET    | /api/settings        | Public                   |
| PUT    | /api/settings        | Admin                    |

---

## 🚀 Deployment Guide

### Step A — Deploy Backend to Render (Free)

1. Push your `backend` folder to a GitHub repository
2. Go to [https://render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: brandlift-api
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables** (same as your `.env`):
   - `MONGODB_URI` = your Atlas URI
   - `JWT_SECRET` = your secret
   - `JWT_EXPIRES_IN` = 7d
   - `NODE_ENV` = production
   - `FRONTEND_URL` = https://your-app.vercel.app (fill after deploying frontend)
6. Click **Create Web Service**
7. Copy the URL, e.g.: `https://brandlift-api.onrender.com`

---

### Step B — Deploy Frontend to Vercel (Free)

1. Push your `frontend` folder to GitHub
2. Go to [https://vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Configure:
   - **Root Directory**: frontend
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variable**:
   - `VITE_API_URL` = `https://brandlift-api.onrender.com/api`
6. Click **Deploy**
7. Copy the Vercel URL, e.g.: `https://brandlift.vercel.app`

---

### Step C — Update CORS on Backend

After deploying frontend, go back to Render → your service → Environment → update:

```
FRONTEND_URL = https://brandlift.vercel.app
```

Redeploy the backend.

---

## 🔐 Security Checklist Before Going Live

- [ ] Change admin password from `Admin@1234` to something strong
- [ ] Set a strong `JWT_SECRET` (32+ random characters)
- [ ] Change `ADMIN_SETUP_KEY` in `.env`
- [ ] Enable MongoDB Atlas IP whitelist to only your server's IP (optional, for extra security)
- [ ] Set `NODE_ENV=production` on Render

---

## 🛠️ Tech Stack Summary

| Layer     | Technology                       |
| --------- | -------------------------------- |
| Frontend  | React 18, React Router v6, Vite  |
| Styling   | Pure CSS with CSS Variables      |
| Backend   | Node.js, Express.js              |
| Database  | MongoDB Atlas + Mongoose         |
| Auth      | JWT (JSON Web Tokens) + bcryptjs |
| HTTP      | Axios                            |
| Security  | Helmet, express-rate-limit, CORS |
| Deploy FE | Vercel                           |
| Deploy BE | Render                           |
| Deploy DB | MongoDB Atlas (free M0)          |

---

## ❓ FAQ

**Q: The backend says "MongoDB error" on start?**
A: Check your `MONGODB_URI` in `.env`. Make sure you replaced `<username>` and `<password>` with your real Atlas credentials. Also confirm Network Access in Atlas allows 0.0.0.0/0.

**Q: I get 401 Unauthorized in admin?**
A: Run `node seed.js` to create the admin account, then log in at `/admin/login`.

**Q: Images not loading in portfolio?**
A: The seed data uses Unsplash URLs. For production, you can use any image hosting (Cloudinary, ImgBB, etc.) and paste the URL in the admin panel.

**Q: How do I add a new admin user?**
A: POST to `/api/auth/setup` with `{ name, email, password, setupKey }` where `setupKey` matches your `.env` `ADMIN_SETUP_KEY`.

**Q: Render backend goes to sleep on free plan?**
A: Yes, free Render services sleep after 15 min of inactivity. For production use, upgrade to Render Starter ($7/month) or use Railway.app.
