import cors from "cors";
import express from "express";

import corsOptions from "./api/corsConfig.js";
import { checkAPIKey, checkOrigin } from "./api/middleware.js";
import pingRoute from "./api/ping.js";
import apiRouter from "./api/router.js";
import updateDatabase from "./dbUpdater/controller.js";

const app = express();

updateDatabase().catch((error: unknown) => {
  console.error(error);
});

app.use(
  "/api/v1/entries",
  cors(corsOptions),
  checkAPIKey,
  checkOrigin,
  apiRouter,
);

app.use("/api/v1/ping", pingRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Ok",
    service: "Wikidata project backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default app;
