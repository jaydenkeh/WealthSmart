require("dotenv").config();
import express from "express";
import path from "path";

const PORT = 3000;
const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
