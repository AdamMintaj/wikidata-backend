import { Entity } from "../dbUpdater/types.js";

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

/**
 * Resolves the urls of images from a given array of entities.
 *
 * It fetches from image urls of given entities, follows the redirects and
 * creates a new array where objects' image urls are direct links to the resource.
 * If resolution fails for an entity, the original URL is preserved.
 *
 * The function is not optimized for large arrays. It requires a network request for
 * each entity, so using it with large arrays may slow down the response.
 *
 * Resolving urls on the backend ensures that the API returns direct links (less work for frontend).
 *
 * It also fixes the mixed content issue, that prevents the images from loading
 * in some browsers (eg. facebook in-app browser).
 * See: https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
 *
 * @param entities array of `Entity` objects
 * @returns A promise that resolves to an array of `Entity` objects with updated image urls
 */
export async function resolveImgUrls(entities: Entity[]) {
  const promises = entities.map(async (entity) => {
    try {
      const response = await fetch(entity.image, { method: "HEAD" });

      if (!response.ok) return entity;

      return { ...entity, image: response.url };
    } catch {
      return entity;
    }
  });

  return Promise.all(promises);
}
