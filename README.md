# MERN Parking Management System Using Graphql.

A simple **Parking Management System** built using the **MERN stack** (MongoDB, Express, React, Graphql, Node.js).

---

##  Features

### Backend
- ✅ GraphQL API
- ✅ OTP-based authentication (login)
- ✅ Parking booking logic

### Frontend
- ✅ Built with **React + Vite**
- ✅ Clean and responsive UI

---

##  Project Structure

```
backend/   → Server (GraphQL, MongoDB)
frontend/  → React app (Vite)
```

---

## ⚡ Quick Start

### 🔧 Prerequisites

- Node.js (>=16)
- npm
- MongoDB (local or remote)

###  Start Backend

```bash
cd backend
npm install
npm start
```

- Server: `http://localhost:5000`
- GraphQL Playground: `http://localhost:5000/graphql`

### 💻 Start Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`

---

##  Environment Variables

Create a `.env` file inside the `backend/` folder with the following values:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=some_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=app_specific_password
```

---


