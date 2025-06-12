/**
 * Capitalizes the first letter of a given string.
 *
 * @param string Any string
 * @returns Given string with its first letter capitalized
 */
export function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts a height from a given unit to centimeters.
 * Supports meters, centimeters, feet and inches -
 * both in plural and singular, british and american spelling.
 *
 * Returns `null` if the height is not a valid number or if the unit is unsupported.
 *
 * Example: calling `convertHeightToCentimeters("1.75", "metre")` returns `175`
 * @param height Height as a string
 * @param unit Unit name (e.g. "metre", "inches", etc.)
 * @returns Rounded height as an integer or `null` in case of invalid input
 */
export function convertHeightToCentimeters(height: string, unit: string) {
  const number = Number(height);
  if (isNaN(number)) return null;

  const transformedUnitName = unit.toLowerCase().trim();

  const conversionMappings: Record<string, number> = {
    centimeter: 1,
    centimeters: 1,
    centimetre: 1,
    centimetres: 1,
    feet: 30.48,
    foot: 30.48,
    inch: 2.54,
    inches: 2.54,
    meter: 100,
    meters: 100,
    metre: 100,
    metres: 100,
  };

  const conversionFactor = conversionMappings[transformedUnitName];
  if (conversionFactor) return Math.round(number * conversionFactor);
  else return null;
}

/**
 * Extracts wikidata's unique identifier for an entity from a provided string.
 * If no id is found, it returns null instead.
 *
 * Example: passing `"http://www.wikidata.org/entity/Q76"` to the function returns `"Q76"`
 *
 * @param entityUri A string containing a Wikidata entity URI
 * @returns The entity ID as a string, or null if not found
 */
export function extractEntityId(entityUri: string) {
  const searchString = /Q\d+/;

  return searchString.exec(entityUri)?.[0] ?? null;
}

/**
 * Calculates time passed between two dates and returns the difference in whole seconds
 * @param dateA Date
 * @param dateB Date
 * @returns `number` - The time difference in whole seconds
 */
export function getTimeDifference(dateA: Date, dateB: Date) {
  const timeA = dateA.getTime();
  const timeB = dateB.getTime();

  const difference = Math.abs(timeA - timeB);
  return Math.round(difference / 1000);
}
