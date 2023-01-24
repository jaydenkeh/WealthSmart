require("dotenv").config();
import express from "express";
import cors from "cors";
import path from "path";
import { signupRouter } from "./controllers/signupController";
import { loginRouter } from "./controllers/loginController";
import { checkAuthRouter } from "./controllers/checkAuthController";
import { tradingRouter } from "./controllers/tradingController";
import { portfolioRouter } from "./controllers/portfolioController";
import { watchlistRouter } from "./controllers/watchlistController";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/api/me", checkAuthRouter);
app.use("/api/trading", tradingRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/watchlist", watchlistRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
