import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function queryDB<T>(query: string): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}
