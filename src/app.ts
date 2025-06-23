import cors from "cors";
import express from "express";

import corsOptions from "./api/corsConfig.js";
import { checkAPIKey, checkOrigin } from "./api/middleware.js";
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

export default app;
