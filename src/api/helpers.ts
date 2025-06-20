/**
 * Checks if a given string is a valid wikidata entity id.
 *
 * Example valid wikidata id: `Q1001`
 * @param id string
 * @returns boolean
 */
export function checkId(id: string) {
  const searchString = /^Q\d+$/;

  return searchString.test(id);
}
