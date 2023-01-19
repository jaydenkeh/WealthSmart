import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();
const checkAuthRouter = express.Router();

checkAuthRouter.get("/me", verifyJWT, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: (req as any).user.sub },
    select: { email: true },
  });
  return res.json({
    data: user,
  });
});

export { checkAuthRouter };
