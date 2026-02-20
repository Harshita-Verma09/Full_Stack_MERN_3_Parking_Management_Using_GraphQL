//home/harshita-verma/Documents/CODE_FOCUS/MERN_Parking_Sys/backend/src/server.js

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res })
});

async function start() {
    await server.start();

    server.applyMiddleware({
        app,
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    app.listen(5000, () =>
        console.log("Server running on port 5000")
    );
}

start();
