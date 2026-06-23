# 🚀 Orbit — Enterprise OKR & Performance Management Platform

Orbit is a full-stack OKR (Objectives and Key Results) management platform designed to help organizations align strategic objectives, track progress, and improve accountability through structured goal management and performance reviews.

The project was inspired by the challenges of manually tracking goals through spreadsheets, chats, and scattered documents. As deadlines approached, monitoring progress became time-consuming and difficult. Orbit addresses this problem by providing a centralized platform for goal tracking, performance reviews, reporting, and team collaboration.

🌐 **Live Demo:** https://orbit-okr.vercel.app/

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure password hashing using bcrypt
* Protected routes
* Role-Based Access Control (RBAC)

### 🎯 Goal Management

* Create, update, and manage goals
* Track goal progress and completion status
* Assign goals across teams
* Monitor deadlines and performance metrics

### 👥 Multi-Role System

* Employee Dashboard
* Manager Dashboard
* Admin Dashboard

### 📈 Performance Tracking

* Quarterly check-ins
* Progress reviews
* Goal completion monitoring
* Team performance visibility

### 📊 Analytics & Reporting

* Interactive dashboards
* Progress visualization using Recharts
* Organizational performance insights
* Goal completion statistics

### 📝 Audit Logs

* Activity tracking
* Change history
* Accountability and transparency

### 🔔 Notifications

* Goal-related updates
* Progress alerts and reminders

---

## 🏗️ System Architecture

```text
React Frontend (Vercel)
          │
          ▼
Node.js + Express API (Render)
          │
          ▼
PostgreSQL Database (Supabase)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* CORS

### Database

* PostgreSQL
* Supabase

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase PostgreSQL

---

## 📸 Screenshots

### Login Page

Secure authentication interface with role-based access.

### Admin Dashboard

Organization-wide insights, metrics, and analytics.

### Goal Management

Create, assign, and track objectives and key results.

### Audit Logs & Reports

Monitor activities, progress, and organizational performance.

---

## 🚀 Key Highlights

* Full-stack enterprise application
* Role-Based Access Control (RBAC)
* Secure JWT authentication
* PostgreSQL database integration
* RESTful API architecture
* Interactive analytics dashboards
* Goal tracking and performance management
* Production deployment on Vercel and Render
* Cloud-hosted PostgreSQL using Supabase

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd okr-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Run the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

---

## 📂 Project Structure

```text
okr-system/
│
├── backend/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── public/
│   └── src/
│
├── package.json
└── README.md
```

---

## 🔮 Future Enhancements

* Email notifications
* Advanced analytics and reporting
* Goal templates
* Calendar integration
* Real-time updates
* AI-assisted OKR recommendations

---

## 👨‍💻 Author

**Ateeb Tahir**
Computer Science Engineering
Delhi Technological University (DTU)

---

## 📄 License

This project is intended for educational, learning, and portfolio purposes.

<img width="1911" height="920" alt="image" src="https://github.com/user-attachments/assets/24fbe024-5471-4a02-9e72-70d9da4c208b" />
<img width="1654" height="883" alt="image" src="https://github.com/user-attachments/assets/e694edb6-5ecc-4cd1-9621-2612bd00d950" />
<img width="1592" height="896" alt="image" src="https://github.com/user-attachments/assets/66153aff-19db-4ceb-90a5-9b946a3f30d0" />
<img width="1596" height="799" alt="image" src="https://github.com/user-attachments/assets/c1ba1283-90f1-4ea3-8f49-c5efed517806" />
<img width="1345" height="920" alt="image" src="https://github.com/user-attachments/assets/5bfff6fc-dd15-46eb-9be3-62217ed7909f" />

<img width="1557" height="881" alt="image" src="https://github.com/user-attachments/assets/4826e53c-a7b7-497b-953f-b65fbd1c20a0" />
![](https://komarev.com/ghpvc/?username=Ateeb527)
