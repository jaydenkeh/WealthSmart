import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const signupRouter = express.Router();

signupRouter.post("/", async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count({
      where: { email: req.body.email },
    });
    if (userCount > 0) {
      return res
        .status(409)
        .json({ message: "Email in use, please use a different one" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await prisma.user.create({
      data: {
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword,
      },
    });
    res.status(201).json({ message: "User account created successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { signupRouter };
