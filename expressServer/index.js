import cors from "cors";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { resolvers } from "./graphql/resolver.js";
import { readFile } from "node:fs/promises";
import {
  authMiddleware,
  handleLogin,
  handleRegister,
} from "./middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);
const prisma = new PrismaClient();

app.post("/login", handleLogin);
app.post("/register", handleRegister);

const typeDefs = await readFile("./graphql/schema.graphql", "utf8");

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
});
await apolloServer.start();

async function getContext({ req }) {
  if (req.auth) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.auth.sub,
      },
    });
    return { user };
  }

  return {};
}
app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
