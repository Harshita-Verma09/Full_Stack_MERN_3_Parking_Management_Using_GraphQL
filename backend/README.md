# Backend — MERN Parking System Using Graphql

Backend is a GraphQL server built with Express and Apollo, using MongoDB via Mongoose.

Run (from `backend/`):

```bash
npm install
npm start
```

- Server listens on port `5000`.
- GraphQL endpoint: `http://localhost:5000/graphql`.

Environment variables (create `backend/.env`):

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password_or_app_password
```

Key features

- OTP-based login: `login` mutation sends OTP, `verifyOTP` returns JWT.
- Booking and parking-slot management via GraphQL `Query`/`Mutation`.

Notes

- `authMiddleware.js` placeholder exists; resolvers expect `Authorization: Bearer <token>` header for protected queries/mutations.
- Update CORS/origin in `src/server.js` if your frontend runs on a different port.
