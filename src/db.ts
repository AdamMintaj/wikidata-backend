import { Pool, QueryResult, QueryResultRow } from "pg";

import { handleError } from "./dbUpdater/helpers.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Queries the database with a given SQL query and set of parameters and returns the result.
 *
 * Throws an error if the query fails.
 *
 * The generic type parameter `<T>` allows specifying the expected shape of each row
 * in the result set.
 * @param query `string` with a SQL query for the database.
 * @param params `unknown` array of parameters to pass with the query (optional).
 * @returns `Promise` that resolves to a `<QueryResult<T>>`.
 */

export async function queryDB<T extends QueryResultRow>(
  query: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query, params);
    return result;
  } catch (error) {
    handleError(error);
  } finally {
    client.release();
  }
}
