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
    // if no portfolio for that symbol for the user, create a new one
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          symbol,
          quantity,
          purchasePrice: price,
          user: { connect: { email: userEmail } },
        },
      });
    } else {
      if (action === "buy") {
        // Update the existing portfolio for a buy
        portfolio.quantity += quantity;
        portfolio.purchasePrice =
          (portfolio.purchasePrice * (portfolio.quantity - quantity) +
            price * quantity) /
          portfolio.quantity;
      } else {
        if (portfolio.quantity < quantity) {
          // If the user is trying to sell more than they own, return an error
          return res
            .status(400)
            .json({ message: "Sell quantity is greater than current holding" });
        }
        // Update the existing portfolio for a sell
        portfolio.quantity -= quantity;
        portfolio.purchasePrice =
          (portfolio.purchasePrice * (portfolio.quantity + quantity) -
            price * quantity) /
          portfolio.quantity;
      }
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: {
          quantity: portfolio.quantity,
          purchasePrice: portfolio.purchasePrice,
        },
      });
    }
    // Create the trade for records
    const trade = await prisma.trading.create({
      data: {
        action,
        price,
        symbol,
        quantity,
        user: { connect: { email: userEmail } },
      },
    });
    res
      .status(201)
      .json({ message: "Trade created successfully", trade, portfolio });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { tradingRouter };
