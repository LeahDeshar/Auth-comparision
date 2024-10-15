// import cors from "cors";
// import express from "express";
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
// import { resolvers } from "./graphql/resolver.js";
// import { readFile } from "node:fs/promises";
// import jwt from "jsonwebtoken";

// const PORT = 9000;
// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// const app = express();
// app.use(cors(), express.json());

// const typeDefs = await readFile("./graphql/schema.graphql", "utf8");

// const apolloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: async ({ req }) => {
//     console.log(req.headers);
//     const authHeader = req.headers.authorization || "";
//     // console.log(authHeader);
//     const token = authHeader.split(" ")[1];
//     console.log(token);
//     let user = null;

//     if (token) {
//       try {
//         user = jwt.verify(token, JWT_SECRET); // Verify the token and extract user information
//       } catch (error) {
//         console.error("Token verification failed:", error);
//       }
//     }

//     return { user };
//   },
// });

// await apolloServer.start();

// app.use("/graphql", apolloMiddleware(apolloServer));

// app.listen({ port: PORT }, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
// });
import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { resolvers } from "./graphql/resolver.js";
import { readFile } from "node:fs/promises";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/authMiddleware.js";
const PORT = 9000;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const app = express();
app.use(cors());
app.use(express.json());

const typeDefs = await readFile("./graphql/schema.graphql", "utf8");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log("req", req);
    const authHeader = req.headers.authorization || "";
    console.log("Authorization Header:", authHeader); // Log to see the auth header
    const token = authHeader.split(" ")[1]; // Extract token
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET); // Verify token
        console.log("User from token:", user); // Log user from token
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    }

    return { user }; // Return user object in context
  },
});

await apolloServer.start();

app.use("/graphql", apolloMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
