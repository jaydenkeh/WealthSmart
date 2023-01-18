import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

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
  // create JWT token
  // const token = createJWT(user.id);
  // return res.json({ token });

  res.status(200).json({ message: "Logged in successfully" });
});

export { loginRouter };
