// //home/harshita-verma/Documents/CODE_FOCUS/MERN_Parking_Sys/backend/src/server.js


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

  //  GraphQL + CORS FIX
  server.applyMiddleware({
    app,
    cors: {
      origin: true,
      credentials: true
    }
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start();
