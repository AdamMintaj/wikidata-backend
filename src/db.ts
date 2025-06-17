import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

import { handleError } from "./dbUpdater/helpers.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export enum AdvisoryLockKey {
  INSERTING_ENTITIES = 1918,
}

/**
 * Queries the database with a given SQL query and set of parameters and returns the result.
 * The function may be provided with a client to use in a query - if not, it will take one from the pool.
 *
 * Throws an error if the query fails.
 *
 * The generic type parameter `<T>` allows specifying the expected shape of each row
 * in the result set.
 * @param query `string` with a SQL query for the database.
 * @param params array of parameters to pass with the query (optional).
 * @param client `PoolClient` client to use in the query. This function won't release it
 * so remember to do it wherever it's been created.
 * @returns `Promise` that resolves to a `<QueryResult<T>>`.
 */

export async function queryDB<T extends QueryResultRow>(
  query: string,
  params?: unknown[],
  client?: PoolClient,
): Promise<QueryResult<T>> {
  const dbClient = client ?? (await pool.connect());
  try {
    const result = await dbClient.query<T>(query, params);
    return result;
  } catch (error) {
    return handleError(error); // "return" in this line is not necessary really, it's just to satisfy typescript because "if(!client)" in the finally block makes it think that the function might actually return undefined sometimes (even though it doesn't)
  } finally {
    if (!client) dbClient.release();
  }
}

/**
 * Executes a SQL query within a transaction that uses a transaction-level advisory lock.
 * Internally, it calls queryDB with a given SQL query and set of parameters.
 *
 * The advisory lock ensures that only one operation using the same lock key
 * can run at a time, preventing conflicts between concurrent operations.
 *
 * The generic type parameter `<T>` allows specifying the expected shape of each row
 * in the result set.
 * @param query `string` with a SQL query for the database.
 * @param lockKey key from `AdvisoryLockKey` representing the type of operation to lock.
 * @param params array of parameters to pass with the query (optional).
 * @returns `Promise` that resolves to a `<QueryResult<T>>`.
 */
export async function queryDBWithLock<T extends QueryResultRow>(
  query: string,
  lockKey: AdvisoryLockKey,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [lockKey]);

    const result = await queryDB<T>(query, params, client);

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    handleError(error);
  } finally {
    client.release();
  }
}
