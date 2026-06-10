import { neon } from "@neondatabase/serverless";

// Single shared SQL client for the Neon serverless driver. `neon()` returns a
// tagged-template function that runs each query over HTTP, so it's safe to use
// from route handlers and server components without managing a pool.
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set (see .env.local)");
}

export const sql = neon(url);
