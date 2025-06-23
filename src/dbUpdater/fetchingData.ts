import { handleError } from "./helpers.js";
import { UnfilteredWikidata } from "./types.js";
import query from "./wikidataQuery.js";

const url = "https://query.wikidata.org/sparql";
const options = {
  body: `query=${encodeURIComponent(query)}`,
  headers: {
    Accept: "application/sparql-results+json",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "WikidataProjectBackend/1.0 (maliszewski.aa@gmail.com)",
  },
  method: "POST",
};

/**
 * Sends a query to Wikidata sparql service using a predefined query.
 * @returns Raw response from Wikidata
 */
async function fetchWikidata() {
  try {
    const response = await fetch(url, options);

    if (!response.ok)
      throw new Error(`Response status: ${response.status.toString()}`);

    const data = (await response.json()) as UnfilteredWikidata;
    return data;
  } catch (error) {
    handleError(error, "Wikidata request failed: ");
  }
}

export default fetchWikidata;
