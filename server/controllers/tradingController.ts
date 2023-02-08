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
    // User purchasing for the very first time when no portfolio exists
    if (action === "buy" && !portfolio && accountValue) {
      portfolio = await prisma.portfolio.create({
        data: {
          symbol: symbol,
          quantity: quantity,
          purchasePrice: price,
          user: { connect: { email: userEmail } },
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
      return res.status(201).json({
        message: "Trade successful",
        trade,
        portfolio,
        updatedAccountBalances,
      });
    }
    // If user try to sell for the very first time even before owning the security, return message not enough shares
    if (action === "sell" && !portfolio) {
      return res
        .status(400)
        .json({ message: "You do not have enough shares to sell" });
    }
    if (portfolio) {
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
        return res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
      // If user try to oversell, return message not enough shares
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
        return res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
      // If user sells every shares of existing holding, portfolio record will be deleted
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
        return res.status(201).json({
          message: "Trade successful",
          trade,
          portfolio,
          updatedAccountBalances,
        });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

tradingRouter.get("/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const tradingHistory = await prisma.trading.findMany({
      where: {
        AND: [{ userEmail: email }],
      },
    });
    if (!tradingHistory) {
      return res.status(404).json({ message: "trading history not found" });
    }
    res.status(200).json({ tradingHistory });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
});

export { tradingRouter };
