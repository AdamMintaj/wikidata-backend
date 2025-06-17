import fetchWikidata from "./fetchingData.js";
import { getTimeDifference } from "./helpers.js";
import { deduplicateDataByHeight, extractData } from "./processingData.js";
import { FetchLogData } from "./types.js";
import checkIfUpdateNeeded from "./updateChecker.js";
import { insertEntities, insertNewFetchLog } from "./updatingDatabase.js";

/**
 * Runs the process of updating the database with new data from Wikidata in following steps:
 *
 * - Checks if an update is needed (update period can be set in env variable)
 * - If an update is due, fetches data from Wikidata
 * - Processes the data
 * - Inserts new entries to the database
 * - Logs the outcome to the console and adds a new log to the database
 *
 * Any caught errors are included in the logs stored in the database.
 *
 * @returns `Promise<void>` that resolves when the update process is complete.
 */
async function updateDatabase() {
  const start = new Date();
  let shouldUpdate;

  const updateMetadata: FetchLogData = {
    successful: false,
    entriesFetched: 0,
    entriesAdded: 0,
    durationSeconds: 0,
  };

  try {
    shouldUpdate = await checkIfUpdateNeeded();
  } catch (error) {
    const err = error as Error;
    updateMetadata.errorMessage = err.message;
    console.error(err.message);
    await insertNewFetchLog(updateMetadata);
    return;
  }

  if (!shouldUpdate) {
    console.log("Update not needed. Exiting the updater.");
    return;
  }

  try {
    const data = await fetchWikidata();
    const processedData = extractData(data);
    updateMetadata.entriesFetched = processedData.length;

    const dedupedData = deduplicateDataByHeight(processedData);
    updateMetadata.entriesAdded = await insertEntities(dedupedData);

    updateMetadata.successful = true;
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    updateMetadata.errorMessage = err.message;
  } finally {
    updateMetadata.durationSeconds = getTimeDifference(start, new Date());
    await insertNewFetchLog(updateMetadata);
    console.log(
      updateMetadata.successful
        ? "Updated the database successfully."
        : "Database update failed.",
    );
  }
}

export default updateDatabase;
