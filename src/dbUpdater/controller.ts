import fetchWikidata from "./fetchingData.js";
import { getTimeDifference } from "./helpers.js";
import { deduplicateDataByHeight, extractData } from "./processingData.js";
import { FetchLogData } from "./types.js";
import checkIfUpdateNeeded from "./updateChecker.js";
import { insertEntities, insertNewFetchLog } from "./updatingDatabase.js";

async function updateDatabase() {
  const start = new Date();
  const shouldUpdate = await checkIfUpdateNeeded();

  if (!shouldUpdate) {
    console.log("Update not needed. Exitting the updater.");
    return;
  }

  const operationMetadata: FetchLogData = {
    successful: false,
    entriesFetched: 0,
    entriesAdded: 0,
    durationSeconds: 0,
  };

  try {
    const data = await fetchWikidata();
    const processedData = extractData(data);
    operationMetadata.entriesFetched = processedData.length;

    const dedupedData = deduplicateDataByHeight(processedData);
    operationMetadata.entriesAdded = await insertEntities(dedupedData);

    operationMetadata.successful = true;
  } catch (error) {
    console.log(error);
    // handle errors and add error code and message to fetch log later
  } finally {
    operationMetadata.durationSeconds = getTimeDifference(start, new Date());
    // catch possible errors from insertNewFetchLog
    await insertNewFetchLog(operationMetadata);
    console.log(
      operationMetadata.successful
        ? "Updated the database successfully."
        : "Database update failed.",
    );
  }
}

export default updateDatabase;
