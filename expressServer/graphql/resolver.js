import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// export const resolvers = {
//   Query: {
//     me: async (_, __, { user }) => {
//       if (!user) {
//         throw new Error("Not authenticated");
//       }

//       // Fetch the authenticated user from the database
//       return prisma.user.findUnique({
//         where: { id: user.id },
//       });
//     },
//   },

//   Mutation: {
//     login: async (_, { email, password }) => {
//       // Find the user by email in the database
//       const user = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (!user) {
//         throw new Error("User not found");
//       }

//       // Compare the provided password with the stored hashed password
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         throw new Error("Invalid password");
//       }

//       // Generate a JWT token for the authenticated user
//       const token = jwt.sign(
//         { id: user.id, email: user.email, role: user.role },
//         JWT_SECRET,
//         {
//           expiresIn: "1h", // Token expiration time
//         }
//       );

//       return token; // Return the generated token
//     },
//   },
// };

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      console.log(user);
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Fetch the authenticated user from the database
      return prisma.user.findUnique({
        where: { id: user.id },
      });
    },
  },

  Mutation: {
    register: async (_, { email, password, name }) => {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create a new user in the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name, // You can customize this based on your user model
        },
      });

      // Generate a JWT token for the new user
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role }, // Make sure to include role if applicable
        JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      console.log(token);
      return token; // Return the generated token
    },
    login: async (_, { email, password }) => {
      // Find the user by email in the database
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      // Generate a JWT token for the authenticated user
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );
      console.log(token);

      return token; // Return the generated token
    },
  },
};
