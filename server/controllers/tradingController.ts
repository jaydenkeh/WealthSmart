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
    let accountValue = await prisma.accountValue.findFirst({
      where: { userEmail },
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
      // Calculation of profit or loss for sell order executed by user (not used for buy orders)
      let profitorloss = price * quantity - portfolio.purchasePrice * quantity;
      if (action === "buy" && accountValue) {
        // Update the existing portfolio quantity for a buy order
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
        const trade = await prisma.trading.create({
          data: {
            action: action,
            price: price,
            symbol: symbol,
            quantity: quantity,
            user: { connect: { email: userEmail } },
          },
        });
        const updatedAccountBalances = await prisma.accountValue.update({
          where: { id: accountValue.id },
          data: {
            totalCashBalance: accountValue.totalCashBalance - price * quantity,
          },
        });
        res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
      if (action === "sell" && portfolio.quantity < quantity) {
        return res
          .status(400)
          .json({ message: "You do not have enough shares to sell" });
      }
      if (action === "sell" && portfolio.quantity >= quantity && accountValue) {
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: {
            quantity: portfolio.quantity - quantity,
          },
        });
        const trade = await prisma.trading.create({
          data: {
            action: action,
            price: price,
            symbol: symbol,
            quantity: quantity,
            profitloss: profitorloss,
            user: { connect: { email: userEmail } },
          },
        });
        const updatedAccountBalances = await prisma.accountValue.update({
          where: { id: accountValue.id },
          data: {
            totalCashBalance: accountValue.totalCashBalance + price * quantity,
            accumulatedProfitLoss:
              accountValue.accumulatedProfitLoss + profitorloss,
          },
        });
        res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
      if (
        action === "sell" &&
        portfolio.quantity === quantity &&
        accountValue
      ) {
        await prisma.portfolio.delete({
          where: { id: portfolio.id },
        });
        const trade = await prisma.trading.create({
          data: {
            action: action,
            price: price,
            symbol: symbol,
            quantity: quantity,
            profitloss: profitorloss,
            user: { connect: { email: userEmail } },
          },
        });
        const updatedAccountBalances = await prisma.accountValue.update({
          where: { id: accountValue.id },
          data: {
            totalCashBalance: accountValue.totalCashBalance + price * quantity,
            accumulatedProfitLoss:
              accountValue.accumulatedProfitLoss + profitorloss,
          },
        });
        res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { tradingRouter };
