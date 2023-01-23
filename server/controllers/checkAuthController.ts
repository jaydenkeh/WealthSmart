import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();
const checkAuthRouter = express.Router();

checkAuthRouter.get("/", verifyJWT, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: (req as any).user.sub },
  });
  if (user) {
    console.log(user);
    return res.json({
      data: {
        user: {
          userName: user.userName,
          email: user.email,
        },
      },
    });
  }
});

export { checkAuthRouter };
