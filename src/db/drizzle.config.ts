import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER;
const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD;

let config;

if (databaseUrl) {
  const isSupabase = databaseUrl.includes('supabase');
  config = defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    schemaFilter: ["public"],
    dbCredentials: {
      url: databaseUrl,
      ssl: isSupabase ? { rejectUnauthorized: false } : false,
    },
    verbose: true,
  });
} else {
  if (!sqlHost) {
    throw new Error("Either DATABASE_URL or SQL_HOST must be set in environment variables.");
  }
  if (!sqlDbName) {
    throw new Error("SQL_DB_NAME must be set in environment variables.");
  }
  if (!user) {
    throw new Error("SQL_USER or SQL_ADMIN_USER must be set in environment variables.");
  }
  if (!password) {
    throw new Error("SQL_PASSWORD or SQL_ADMIN_PASSWORD must be set in environment variables.");
  }
  console.log(`Using user: ${user} to connect to database.`);

  const isSupabase = sqlHost.includes('supabase');

  config = defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle", // Output directory for migrations.
    dialect: "postgresql",
    schemaFilter: ["public"],
    dbCredentials: {
      host: sqlHost,
      port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
      user: user,
      password: password,
      database: sqlDbName,
      ssl: isSupabase ? { rejectUnauthorized: false } : false,
    },
    verbose: true,
  });
}

export default config;
