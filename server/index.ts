require("dotenv").config();
import express from "express";
import cors from "cors";
import path from "path";
import { signupRouter } from "./controllers/signupController";
import { loginRouter } from "./controllers/loginController";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
