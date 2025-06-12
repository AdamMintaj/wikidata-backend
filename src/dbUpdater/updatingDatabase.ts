import { queryDB } from "../db.js";
import { Entity } from "./types.js";

/**
 * Creates a set of placeholders to use in sql query from an array of Entity objects.
 *
 * Example result: `($1,$2,$3,$4,$5),($6, $7, $8, $9, $10)`.
 * @param entities Array of entities that the placeholders should be prepared for.
 * @returns `string`
 */
function generateQueryPlaceholders(entities: Entity[]) {
  const entitiesTotal = entities.length;
  const valuesPerEntity = Object.values(entities[0]).length;
  const placeholdersTotal = entitiesTotal * valuesPerEntity;

  const placeholders = [];

  for (let i = 1; i <= placeholdersTotal; i++) {
    placeholders.push(`$${i.toString()}`);
  }

  const placeholdersGroupedByEntity = [];

  for (let i = 0; i < entitiesTotal; i++) {
    const fragment = `(${placeholders.splice(0, valuesPerEntity).join(",")})`;
    placeholdersGroupedByEntity.push(fragment);
  }

  return placeholdersGroupedByEntity.join(",");
}

/**
 * Takes an array of Entity objects and inserts them into the database.
 * Entries already existing in the database are ignored.
 * @param entities Array of entities to add to the database
 * @returns
 */
async function insertEntities(entities: Entity[]) {
  if (entities.length == 0) return;

  const queryPlaceholders = generateQueryPlaceholders(entities);
  const values: Entity[keyof Entity][] = [];

  entities.forEach((entity) => {
    values.push(
      entity.id,
      entity.name,
      entity.description,
      entity.height,
      entity.image,
    );
  });

  const query = `
    INSERT INTO data (id, name, description, height, image)
    VALUES ${queryPlaceholders}
    ON CONFLICT (id) DO NOTHING;
  `;

  await queryDB(query, values);
}

export default insertEntities;
