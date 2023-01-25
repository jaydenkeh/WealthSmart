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
      res.json({ accountValue });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching account value" });
    console.log(err);
  }
});

accountValueRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      totalAssets,
      totalSecuritiesValue,
      cashBalance,
      totalProfitLoss,
      userEmail,
    } = req.body;
    const accountValue = await prisma.accountValue.create({
      data: {
        totalAssets,
        totalSecuritiesValue,
        cashBalance,
        totalProfitLoss,
        user: { connect: { email: userEmail } },
      },
    });
    res.status(201).json({ accountValue });
  } catch (err) {
    res.status(500).json({ message: "Error creating account value" });
    console.log(err);
  }
});

accountValueRouter.put("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const { totalAssets, totalSecuritiesValue, cashBalance, totalProfitLoss } =
      req.body;
    const existingAccountValue = await prisma.accountValue.findFirst({
      where: { userEmail: email },
    });
    if (!existingAccountValue) {
      res.status(404).json({ message: "Account value not found for user" });
    } else {
      const accountValue = await prisma.accountValue.update({
        where: { id: existingAccountValue.id },
        data: {
          totalAssets,
          totalSecuritiesValue,
          cashBalance,
          totalProfitLoss,
        },
      });
      res.json({ accountValue });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating account value" });
    console.log(err);
  }
});

export { accountValueRouter };
