import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const accountValueRouter = express.Router();

accountValueRouter.get("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const accountValue = await prisma.accountValue.findFirst({
      where: { userEmail: email },
    });
    if (!accountValue) {
      res.status(404).json({ message: "Account value not found for user" });
    } else {
      res.status(201).json({ accountValue });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching account value" });
    console.log(err);
  }
});

accountValueRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.body;
    const accountValue = await prisma.accountValue.create({
      data: {
        user: { connect: { email: userEmail } },
      },
    });
    res.status(201).json({ accountValue });
  } catch (err) {
    res.status(500).json({ message: "Error creating account value" });
    console.log(err);
  }
});

export { accountValueRouter };
