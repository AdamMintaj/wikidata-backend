import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Eluwina mordo");
});

export const chuj = "dupa dupa chuj";

export default app;
