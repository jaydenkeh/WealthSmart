import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const watchlistRouter = express.Router();

watchlistRouter.get("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const watchlist = await prisma.watchlist.findMany({
      where: { userEmail: email },
    });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }
    res.json({ watchlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

watchlistRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      userEmail,
      symbol,
      companyName,
      price,
      priceChange,
      percentChange,
      volume,
    } = req.body;
    const watchlist = await prisma.watchlist.create({
      data: {
        symbol: symbol,
        companyName: companyName,
        price: price,
        priceChange: priceChange,
        percentChange: percentChange,
        volume: volume,
        user: { connect: { email: userEmail } },
      },
    });
    res.json({ watchlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

watchlistRouter.delete(
  "/:email/:symbol",
  async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const symbol = req.params.symbol;
      const deletedWatchlist = await prisma.watchlist.deleteMany({
        where: {
          AND: [{ userEmail: email }, { symbol }],
        },
      });
      if (!deletedWatchlist) {
        return res.status(404).json({ message: "Watchlist not found" });
      }
      res.json({ message: "Symbol deleted from watchlist successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    } finally {
      await prisma.$disconnect();
    }
  }
);

export { watchlistRouter };
