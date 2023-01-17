import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const signupRouter = express.Router();

signupRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      },
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { signupRouter };
