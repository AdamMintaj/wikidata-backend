import fetchWikidata from "./fetchingData.js";
import { getTimeDifference } from "./helpers.js";
import { deduplicateDataByHeight, extractData } from "./processingData.js";
import { FetchLogData } from "./types.js";
import checkIfUpdateNeeded from "./updateChecker.js";
import { insertEntities, insertNewFetchLog } from "./updatingDatabase.js";

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
