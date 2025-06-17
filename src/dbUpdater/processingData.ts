import {
  capitalizeString,
  convertHeightToCentimeters,
  extractEntityId,
  handleError,
} from "./helpers.js";
import { Entity, UnfilteredWikidata } from "./types.js";

/**
 * Extracts and formats relevant information from raw Wikidata response.
 * Each returned object represents a single, complete database entry.
 * Entries with missing or invalid data are excluded from the returned array.
 *
 * Throws an error if the data cannot be procesed - although this is unlikely
 * unless the structure of the SPARQL query changes.
 *
 * @param data Raw response from the Wikidata SPARQL query
 * @returns Array of `Entity` objects
 */
export function extractData(data: UnfilteredWikidata) {
  const bindings = data.results.bindings;

  try {
    const extractedData = bindings.map((binding) => {
      const entity = {
        description: capitalizeString(binding.itemDescription.value),
        height: convertHeightToCentimeters(
          binding.heightValue.value,
          binding.heightUnitLabel.value,
        ),
        id: extractEntityId(binding.item.value),
        image: binding.image.value,
        name: binding.itemLabel.value,
      };
      const hasNullValues = Object.values(entity).some(
        (value) => value === null,
      );
      if (!hasNullValues) return entity as Entity;
    });
    return extractedData.filter((item) => item != undefined);
  } catch (error) {
    handleError(error, "Extracting data failed");
  }
}

/**
 * Data returned from Wikidata query may have multiple entries for the same entity -
 * and usually they only differ in height value.
 *
 * This function takes formatted data returned by `extractData` function and gets rid
 * of duplicate entries, leaving only the entry with the highest height value.
 * @param data Array of `Entity` objects
 * @returns Array of `Entity` objects, without duplicate entries
 */
export function deduplicateDataByHeight(data: Entity[]) {
  const entitiesMap = new Map<string, Entity>();

  for (const entity of data) {
    const existingEntity = entitiesMap.get(entity.id);

    if (!existingEntity) {
      entitiesMap.set(entity.id, entity);
    } else {
      const previousHeight = existingEntity.height;
      const newHeight = entity.height;
      entitiesMap.set(entity.id, {
        ...entity,
        height: Math.max(previousHeight, newHeight),
      });
    }
  }
  return [...entitiesMap.values()];
}
