import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set.");
}

const sql = neon(databaseUrl);
const migrationPath = join(process.cwd(), "db", "migrations", "001_create_projects.sql");
const migration = await readFile(migrationPath, "utf8");

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

const statements = splitSqlStatements(migration);

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Applied database migration: 001_create_projects.sql");
