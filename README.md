# MERN Parking Management System Using Graphql.

यह repository एक साधारण MERN-stack (MongoDB, Express, React, Node) पर आधारित Parking Management System है।

- Backend: GraphQL API, OTP-based login, booking logic
- Frontend: React + Vite UI

Repository structure

- `backend/` — server (GraphQL, MongoDB)
- `frontend/` — React app (Vite)

Quick start

Prerequisites: `node` (>=16), `npm`, MongoDB (remote or local)

1. Start backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000` and GraphQL playground at `http://localhost:5000/graphql`.

2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default Vite URL: `http://localhost:5173`.

Environment

Create a `.env` file inside `backend/` with at least:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=some_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=app_specific_password
```

Contributing

- Open issues or pull requests on GitHub.

License

- Add your preferred license here.
