# ⚡ OKR Management System

Full-stack OKR (Objectives & Key Results) system built with **React + Node.js + PostgreSQL**.

---

## 📁 Project Structure

```
okr-system/
├── backend/               ← Node.js + Express API
│   ├── db/
│   │   ├── index.js       ← DB connection
│   │   └── schema.sql     ← Run this to create tables
│   ├── middleware/
│   │   └── auth.js        ← JWT middleware
│   ├── routes/
│   │   ├── auth.js        ← Login / register
│   │   ├── goals.js       ← Goal CRUD + approval
│   │   ├── checkins.js    ← Quarterly check-ins
│   │   └── users.js       ← Users, stats, notifications, audit
│   ├── server.js          ← Entry point
│   ├── .env.example       ← Copy to .env
│   └── package.json
│
├── frontend/              ← React app
│   ├── src/
│   │   ├── context/       ← Auth context
│   │   ├── components/    ← Sidebar
│   │   ├── pages/         ← All pages
│   │   ├── App.js         ← Router
│   │   └── index.css      ← Global styles
│   └── package.json
│
└── README.md
```

---

## 🚀 SETUP GUIDE (Step by Step)

### STEP 1 — Prerequisites (Install these first)

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| Git | https://git-scm.com |
| PostgreSQL (local) OR Supabase (cloud, free) | https://supabase.com |

---

### STEP 2 — Download / Clone the Project

**Option A: If you have a ZIP file**
```bash
unzip okr-system.zip
cd okr-system
```

**Option B: If on GitHub**
```bash
git clone https://github.com/YOUR_USERNAME/okr-system.git
cd okr-system
```

---

### STEP 3 — Set Up the Database

#### Option A: Supabase (Recommended for hackathon — free, no install)
1. Go to https://supabase.com → Create free account
2. Click **New Project** → name it `okr-db`
3. Go to **SQL Editor** in sidebar
4. Open `backend/db/schema.sql` and paste the entire content → click **Run**
5. Go to **Project Settings → Database → Connection String (URI)**
6. Copy the connection string — it looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```

#### Option B: Local PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE okr_db;
\q

# Run schema
psql -U postgres -d okr_db -f backend/db/schema.sql
```
Your connection string: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/okr_db`

---

### STEP 4 — Configure Backend

```bash
cd backend

# Copy the example env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/okr_db
JWT_SECRET=any_random_long_string_like_abc123xyz789
NODE_ENV=development
```

---

### STEP 5 — Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

✅ You should see: `Server running on port 5000`

Test it: open http://localhost:5000/api/health → should show `{"status":"OK"}`

---

### STEP 6 — Install & Run Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

✅ Browser opens at http://localhost:3000

---

### STEP 7 — Login

Use demo accounts (seeded from schema.sql):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password |
| Manager | manager@company.com | password |
| Employee | employee@company.com | password |

Or click the quick-login buttons on the login page.

---

## 🎯 Features by Role

### Employee
- Create goals with weightage (10-100%, total must = 100%)
- Edit/delete draft goals
- Submit goals for manager approval
- Quarterly check-ins on approved goals

### Manager
- View team's submitted goals
- Approve or reject goals
- View team dashboard with charts
- Comment on employee check-ins

### Admin
- Everything above
- Reports page with CSV export
- Audit log (all system actions)
- All users' goals

---

## 🔌 API Endpoints

```
POST   /api/auth/login              Login
POST   /api/auth/register           Register

GET    /api/goals                   My goals
POST   /api/goals                   Create goal
PUT    /api/goals/:id               Edit goal (draft only)
DELETE /api/goals/:id               Delete goal (draft only)
POST   /api/goals/:id/submit        Submit for approval
POST   /api/goals/:id/review        Approve/reject (manager)
GET    /api/goals/team              Team goals (manager/admin)

GET    /api/checkins/goal/:goalId   Checkins for goal
POST   /api/checkins                Add checkin
PUT    /api/checkins/:id/comment    Manager comment

GET    /api/users                   All users (admin)
GET    /api/users/stats             Dashboard stats
GET    /api/users/notifications     My notifications
GET    /api/users/audit             Audit log (admin)
```

---

## 🚢 DEPLOYMENT

### Frontend → Vercel (Free)
1. Push frontend folder to GitHub
2. Go to https://vercel.com → Import project
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
5. Deploy → you get a `https://xxx.vercel.app` URL

> ⚠️ Update `frontend/package.json` proxy to your Render URL in production, or use `REACT_APP_API_URL` env var in axios calls.

### Backend → Render (Free)
1. Push backend folder to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   ```
   DATABASE_URL=your_supabase_url
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```
7. Deploy → you get a `https://xxx.onrender.com` URL

### Database → Supabase (Already covered in Step 3)

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` on DB | Check DATABASE_URL in .env, make sure DB is running |
| `Invalid token` | JWT_SECRET mismatch between .env and token |
| `Port 5000 in use` | Change PORT in .env or kill other process |
| CORS error in browser | Backend CORS is open by default, check frontend proxy in package.json |
| `npm ERR!` | Delete `node_modules`, run `npm install` again |
| Supabase SSL error | Make sure `ssl: { rejectUnauthorized: false }` in db/index.js (already set) |

---

## 🏆 Hackathon Tips

1. **Run schema.sql first** — everything breaks without tables
2. **Demo accounts** are pre-seeded — use the quick-login buttons
3. **Show the full flow** to judges: Employee creates → submits → Manager approves → Employee checks in
4. **Weightage validation** is strict (10% min, 100% total) — judges will test this
5. CSV export on Reports page is a great demo moment

---

## 📦 Tech Stack Summary

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Recharts |
| Styling | Pure CSS (no Tailwind needed) |
| Backend | Node.js, Express |
| Auth | JWT (jsonwebtoken) |
| Database | PostgreSQL (via pg) |
| Hosting | Vercel + Render + Supabase |
