import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function verifyJWT(req: Request, res: Response, next: any) {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized to access page" });
  }
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized to access page" });
  }
}
