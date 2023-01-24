import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const portfolioRouter = express.Router();

portfolioRouter.get("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const portfolio = await prisma.portfolio.findMany({
      where: { userEmail: email },
    });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json({ portfolio });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { portfolioRouter };
