import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

function getDatabaseUrl() {
  const rawDatabaseUrl =
    process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();

  if (!rawDatabaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL must be set.");
  }

  const databaseUrl = rawDatabaseUrl
    .replace(/^(DATABASE_URL|POSTGRES_URL)=/, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  let parsedDatabaseUrl;

  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL or POSTGRES_URL must be a valid URL.");
  }

  if (!["postgres:", "postgresql:"].includes(parsedDatabaseUrl.protocol)) {
    throw new Error("DATABASE_URL or POSTGRES_URL must be a Postgres URL.");
  }

  return databaseUrl;
}

const databaseUrl = getDatabaseUrl();
const sql = neon(databaseUrl);
const migrationsDirectory = join(process.cwd(), "db", "migrations");

function splitSqlStatements(source) {
  const statements = [];
  let current = "";
  let inDollarBlock = false;

  for (let index = 0; index < source.length; index += 1) {
    const currentChar = source[index];
    const nextChar = source[index + 1];

    if (currentChar === "$" && nextChar === "$") {
      inDollarBlock = !inDollarBlock;
      current += "$$";
      index += 1;
      continue;
    }

    if (currentChar === ";" && !inDollarBlock) {
      const statement = current.trim();

      if (statement) {
        statements.push(statement);
      }

      current = "";
      continue;
    }

    current += currentChar;
  }

  const finalStatement = current.trim();

  if (finalStatement) {
    statements.push(finalStatement);
  }

  return statements;
}

const migrationFiles = (await readdir(migrationsDirectory))
  .filter((fileName) => fileName.endsWith(".sql"))
  .sort((firstFile, secondFile) => firstFile.localeCompare(secondFile));

for (const migrationFile of migrationFiles) {
  const migrationPath = join(migrationsDirectory, migrationFile);
  const migration = await readFile(migrationPath, "utf8");
  const statements = splitSqlStatements(migration);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Applied database migration: ${migrationFile}`);
}
