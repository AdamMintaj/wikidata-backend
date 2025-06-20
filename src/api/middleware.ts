import { NextFunction, Request, Response } from "express";

/**
 * Middleware that prevents unauthorized acces to the API. Checks if request headers
 * contain the api authorization key and answers with a 403 error if the key is invalid or missing.
 *
 * The api key for comparison is loaded from environment variable (API_KEY). If the key is not present
 * in env file the middleware breaks the request-response cycle and returns 500 error (otherwise you could
 * access the api by passing an empty string in api-key header).
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export const checkAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const key = req.headers["api-key"];

  if (!process.env.API_KEY) {
    console.error("Api key missing");
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  if (key != process.env.API_KEY) {
    res.status(403).json({
      status: "fail",
      message: "Request not authorized",
    });
    return;
  }
  next();
};

/**
 * Middleware that prevents unauthorized acces to the API by validating the request's origin header.
 * The allowed origin is loaded from environment variable (`API_ALLOWED_ORIGIN`).
 *
 * If the origin is not allowed it answers with a 403 error.
 * If the origin is missing or empty in the env file it answers with a 500 error.
 *
 * This step is skipped in dev (if NODE_ENV === "dev").
 *
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export const checkOrigin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "dev") {
    next();
    return;
  }

  const origin = req.headers.origin;

  if (!process.env.API_ALLOWED_ORIGIN) {
    console.error("Allowed origin missing");
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }

  if (!origin || origin !== process.env.API_ALLOWED_ORIGIN) {
    res.status(403).json({
      status: "fail",
      message: "Request not authorized",
    });
    return;
  }

  next();
};
