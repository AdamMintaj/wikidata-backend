import query from "./query.js";
import { UnfilteredWikiData } from "./types.js";

const url = "https://query.wikidata.org/sparql";
const options = {
  body: `query=${encodeURIComponent(query)}`,
  headers: {
    Accept: "application/sparql-results+json",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "my-app/1.0",
  },
  method: "POST",
};

/**
 * Sends a query to wikidata sparql service using a predefined query.
 * @returns Raw response from wikidata
 */
async function fetchWikiData() {
  try {
    const response = await fetch(url, options);

    if (!response.ok)
      throw new Error(`Response status: ${response.status.toString()}`);

    const data = (await response.json()) as UnfilteredWikiData;
    return data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

export default fetchWikiData;
