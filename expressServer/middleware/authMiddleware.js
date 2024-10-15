import { PrismaClient } from "@prisma/client";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const secret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
const prisma = new PrismaClient();

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({
      message: "Invalid user",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const claims = { sub: user.id, email: user.email };
  const token = jwt.sign(claims, secret);
  return res.json({ token });
}

export async function handleRegister(req, res) {
  const { email, password, name } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(500).json({
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return res.status(201).json({
    message: "Register successful",
    newUser,
  });
}
