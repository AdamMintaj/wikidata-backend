/*
  This API path serves as a lightweight and simple way to
  wake up the backend if it's been put to sleep (it's hosted
  on a free-tier service).
  
  It's meant to be used by frontend on startup, to make 
  sure that the backend warms up.
*/

import express, { Request, Response } from "express";

const router = express.Router();

router.route("/").get((req: Request, res: Response) => {
  res.status(200).send("ok");
});

export default router;
