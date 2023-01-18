require("dotenv").config();
import express from "express";
import cors from 'cors'
import path from "path";
import { signupRouter } from "./controllers/signupController";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api/signup", signupRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
