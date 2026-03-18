# MERN Parking Management System Using Graphql.


A simple **Parking Management System** built using the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🧩 Features

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

###  Prerequisites

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

###  Start Frontend

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

##  About this Project

This project is a full-stack parking management solution designed to demonstrate how a modern MERN stack app can handle:

- Secure login via OTP (email-based authentication)
- Parking slot booking and availability tracking
- Role-based features (e.g., user bookings vs. admin management)
- Clean UI built with React and Vite for a great developer experience

##  Tech Stack

- **Backend:** Node.js, Express, GraphQL, MongoDB
- **Frontend:** React, Vite, Tailwind CSS (or plain CSS depending on implementation)
- **Auth:** JWT + OTP via email
- **DB:** MongoDB (local or hosted)

##  More Project Details

### Backend (backend/)
- `src/schema/` - GraphQL schema definitions
- `src/resolvers/` - GraphQL resolvers for queries/mutations
- `src/models/` - Mongoose models (User, Booking, ParkingSlot)
- `src/utils/` - Helpers for auth, email, validation

### Frontend (frontend/)
- `src/components/` - Reusable UI components (cards, forms, layouts)
- `src/pages/` - Pages/routes for the app (login, dashboard, booking)
- `src/services/` - API client + GraphQL hooks

##  Common Tasks

### Run backend in development

```bash
cd backend
npm run dev
```

### Run frontend in development

```bash
cd frontend
npm run dev
```

### Run tests (if available)

Check `backend/package.json` and `frontend/package.json` for test scripts.

##  Contributing

- Open issues
- Submit pull requests
