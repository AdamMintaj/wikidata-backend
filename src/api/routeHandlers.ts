import { Request, Response } from "express";

import { queryDB } from "../db.js";
import { Entity } from "../dbUpdater/types.js";
import { checkId } from "./helpers.js";

/**
 * Sends a 500 internal server error response with the given error's message.
 *
 * Intended for errors thrown by `queryDB`, which are expected to be of type `Error`.
 * Accepts `unknown` to satisfy TypeScript, then safely casts to `Error`.
 * @param res Expres Response
 * @param error unknown
 */
function handleServerError(res: Response, error: unknown) {
  const err = error as Error;

  res.status(500).json({
    status: "error",
    message: `Fetching from database failed: ${err.message}`,
  });
}

/**
 * Fetches all entries from the database. Returns data in a JSend format.
 * @param req Express Request
 * @param res Express Response
 */
export async function getAllEntries(req: Request, res: Response) {
  const query = "SELECT * FROM data";

  try {
    const { rows } = await queryDB<Entity[]>(query);

    res.status(200).json({
      status: "success",
      data: {
        entries: rows,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
}

/**
 * Queries the database for an entry with the given id.
 *
 * Sends a 404 response if no matching entry is found.
 *
 * Returns data in JSend format.
 *
 * @param req Express Request
 * @param res Express Response
 */
export async function getEntry(req: Request, res: Response) {
  const { id } = req.params;
  const idValid = checkId(id);

  if (!idValid) {
    res.status(400).json({
      status: "fail",
      message: "Invalid id",
    });
    return;
  }

  const query = "SELECT * FROM data WHERE id = $1";

  try {
    const { rows, rowCount } = await queryDB(query, [id]);

    if (!rowCount) {
      res.status(404).json({
        status: "error",
        message: "Entry not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        entry: rows[0],
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
}

/**
 * Fetches a random entry from the database, or a specified number of random entries
 * if the number parameter is provided.
 *
 * Returns data in JSend format.
 * @param req Express Request
 * @param res Express Response
 */
export async function getRandomEntries(req: Request, res: Response) {
  const number = Number((req.params.number as string | undefined) ?? 1); // params.number has to be cast as string | undefined because typescript is a little bit dumb here and assumes that it is always a string

  if (isNaN(number)) {
    res.status(400).json({
      status: "fail",
      message: "Invalid number parameter",
    });
    return;
  }

  const query = "SELECT * FROM data ORDER BY RANDOM() LIMIT $1";

  try {
    const { rows } = await queryDB(query, [number]);

    res.status(200).json({
      status: "success",
      data: {
        entries: rows,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
}
