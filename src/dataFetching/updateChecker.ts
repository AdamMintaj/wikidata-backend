import { queryDB } from "../db.js";
import { Timestamp } from "./types.js";

/**
 * Sends a query to the database to get the date of the last data fetch from Wikidata.
 *
 * In a rare scenario where the database has no fetch logs it returns undefined.
 * @returns Promise that resolves to a Date or undefined
 */
async function getLastWikidataFetchDate(): Promise<Date | undefined> {
  const query =
    "SELECT timestamp FROM wikidata_fetch_logs ORDER BY id DESC LIMIT 1;";
  const [response] = await queryDB<Timestamp>(query);
  return response.timestamp;
}

/**
 * Checks if the database should be updated and returns an appropriate boolean value.
 * Internally it calls getLastWikidataFetchDate and calculates the time that passed since.
 * If the time exceeds the update period or there was no previous data fetch it returns true.
 *
 * The update period is expected to come from an environment variable, otherwise it defaults to 7 days.
 * @param DATABASE_UPDATE_PERIOD env variable
 * @returns Promise that resolves to a boolean
 */
async function checkIfUpdateNeeded(): Promise<boolean> {
  let lastWikidataFetchDate: Date | null;

  try {
    const date = await getLastWikidataFetchDate();
    lastWikidataFetchDate = date ?? null;
  } catch (error) {
    console.warn("Getting last Wikidata fetch date failed", error);
    return false;
  }

  if (!lastWikidataFetchDate) return true;

  const previousFetchDateMs = lastWikidataFetchDate.getTime();

  const DEFAULT_UPDATE_PERIOD = 7 * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * miliseconds
  const updatePeriod =
    Number(process.env.DATABASE_UPDATE_PERIOD) || DEFAULT_UPDATE_PERIOD;

  return Date.now() - previousFetchDateMs > updatePeriod;
}

export default checkIfUpdateNeeded;
