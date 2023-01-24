import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const watchlistRouter = express.Router();

export { watchlistRouter };
