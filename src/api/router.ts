import express from "express";

import { getAllEntries, getEntry, getRandomEntries } from "./routeHandlers.js";

const router = express.Router();

router.route("/random{/:number}").get(getRandomEntries); // braces mark an optional route: https://stackoverflow.com/a/41748728/
router.route("/").get(getAllEntries);
router.route("/:id").get(getEntry);

export default router;
