import express from "express";

import updateDatabase from "./dbUpdater/controller.js";

const app = express();

updateDatabase().catch((error: unknown) => {
  console.error(error);
});

app.get("/", (req, res) => {
  res.send("elo");
});

export default app;
