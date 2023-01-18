import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const prisma = new PrismaClient();
const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = createJWT(user.id);
  return res.json({ token });
});

function createJWT(userId: number) {
  const secret = crypto.randomBytes(32).toString("base64");
  const expiresIn = "1d";
  const payload = {
    sub: userId,
    iat: Date.now(),
  };
  return jwt.sign(payload, secret, { expiresIn });
}

export { loginRouter };
