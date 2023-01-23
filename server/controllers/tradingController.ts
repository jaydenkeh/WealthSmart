import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const tradingRouter = express.Router();

tradingRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { action, price, symbol, quantity, userEmail } = req.body;
    // Find the portfolio
    let portfolio = await prisma.portfolio.findFirst({
      where: { userEmail, symbol },
    });
    // if no portfolio exists for the symbol traded for the user, create a new one
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          symbol: symbol,
          quantity: quantity,
          purchasePrice: price,
          user: { connect: { email: userEmail } },
        },
      });
    } else {
      if (action === "buy") {
        // Update the existing portfolio for a buy
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: {
            quantity: portfolio.quantity + quantity,
            purchasePrice:
              (portfolio.purchasePrice * portfolio.quantity +
                price * quantity) /
              (portfolio.quantity + quantity),
          },
        });
      }
      if (action === "sell" && portfolio.quantity < quantity) {
        return res
          .status(400)
          .json({ message: "You do not have enough shares to sell" });
      }
      if (action === "sell" && portfolio.quantity > quantity) {
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: {
            quantity: portfolio.quantity - quantity,
            purchasePrice:
              (portfolio.purchasePrice * portfolio.quantity -
                price * quantity) /
              (portfolio.quantity - quantity),
          },
        });
      }
    }
    // Create the trade for records
    const trade = await prisma.trading.create({
      data: {
        action: action,
        price: price,
        symbol: symbol,
        quantity: quantity,
        user: { connect: { email: userEmail } },
      },
    });
    res.status(201).json({ message: "Trade successful", trade, portfolio });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { tradingRouter };
