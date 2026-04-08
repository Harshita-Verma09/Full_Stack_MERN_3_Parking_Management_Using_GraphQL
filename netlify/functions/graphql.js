const { ApolloServer } = require('apollo-server-lambda');

// Apne existing files import karo
const typeDefs = require('../../src/graphql/typeDefs');
const resolvers = require('../../src/graphql/resolvers');

// (Agar DB connect karna hai)
const connectDB = require('../../src/config/db');

// DB connect (important agar MongoDB use kar rahe ho)
connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => {
        return {
            event,
            context
        };
    }
});

// 🔥 Ye sabse important line hai
exports.handler = server.createHandler();

