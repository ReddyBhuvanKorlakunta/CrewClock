const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const firstEqual = trimmed.indexOf("=");
      if (firstEqual !== -1) {
        const key = trimmed.slice(0, firstEqual).trim();
        let val = trimmed.slice(firstEqual + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("Error: DATABASE_URL not found in env.");
  process.exit(1);
}

const sql = neon(dbUrl);

async function run() {
  console.log("Checking for data in the database...");
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;

  for (const t of tables) {
    const tableName = t.table_name;
    try {
      const countResult = await sql(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const count = countResult[0].count;
      console.log(`Table: ${tableName} -> ${count} rows`);
    } catch (e) {
      console.error(`Table: ${tableName} -> Error counting: ${e.message}`);
    }
  }
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
