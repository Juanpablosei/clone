import "dotenv/config";
import pg from "pg";
import { execSync } from "child_process";

const DATABASE_URL_SOURCE = process.env.DATABASE_URL_SOURCE || process.env.DATABASE_URL;
const DATABASE_URL_TARGET = process.env.DATABASE_URL_TARGET;

if (!DATABASE_URL_SOURCE || !DATABASE_URL_TARGET) {
  console.error("Faltan DATABASE_URL_SOURCE y/o DATABASE_URL_TARGET en .env");
  process.exit(1);
}

// Solo contenido. Excluye auth y migraciones.
const CONTENT_TABLES = [
  "authors",
  "news",
  "news_blocks",
  "partners",
  "worked",
  "team_members",
  "site_config",
  "resource_downloads",
  "resources",
  "home_page",
  "about_us_page",
  "about_us_testimonials",
  "education_page",
  "research_publications_page",
  "advisory_page",
] as const;

const source = new pg.Client({ connectionString: DATABASE_URL_SOURCE });
const target = new pg.Client({ connectionString: DATABASE_URL_TARGET });

async function getColumns(client: pg.Client, tableName: string): Promise<string[]> {
  const res = await client.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [tableName]
  );
  return res.rows.map((r) => r.column_name as string);
}

async function getColumnTypes(
  client: pg.Client,
  tableName: string
): Promise<Record<string, string>> {
  const res = await client.query(
    `SELECT column_name, data_type, udt_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName]
  );

  const out: Record<string, string> = {};
  for (const row of res.rows as { column_name: string; data_type: string; udt_name: string }[]) {
    out[row.column_name] = (row.udt_name || row.data_type || "").toLowerCase();
  }
  return out;
}

async function tableExists(client: pg.Client, tableName: string): Promise<boolean> {
  const res = await client.query(
    `SELECT 1
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName]
  );
  return res.rows.length > 0;
}

async function createTableInTargetFromSource(tableName: string): Promise<boolean> {
  try {
    const columnsRes = await source.query(
      `SELECT
         a.attname AS name,
         pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
         NOT a.attnotnull AS nullable,
         pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default
       FROM pg_catalog.pg_attribute a
       LEFT JOIN pg_catalog.pg_attrdef d
         ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
       WHERE a.attrelid = $1::regclass
         AND a.attnum > 0
         AND NOT a.attisdropped
       ORDER BY a.attnum`,
      [`public.${tableName}`]
    );

    if (columnsRes.rows.length === 0) return false;

    const pkRes = await source.query(
      `SELECT a.attname
       FROM pg_catalog.pg_constraint c
       JOIN pg_catalog.pg_attribute a
         ON a.attrelid = c.conrelid
        AND a.attnum = ANY(c.conkey)
        AND NOT a.attisdropped
        AND a.attnum > 0
       WHERE c.conrelid = $1::regclass
         AND c.contype = 'p'
       ORDER BY array_position(c.conkey, a.attnum)`,
      [`public.${tableName}`]
    );

    const pkColumns = pkRes.rows.map((r) => r.attname as string);
    const columnDefs = columnsRes.rows.map((r) => {
      let sql = `"${String(r.name)}" ${String(r.type)}`;
      if (!r.nullable) sql += " NOT NULL";
      if (r.default && !String(r.default).includes("nextval")) {
        sql += ` DEFAULT ${String(r.default)}`;
      }
      return sql;
    });

    const pkClause =
      pkColumns.length > 0
        ? `, CONSTRAINT "${tableName}_pkey" PRIMARY KEY (${pkColumns
            .map((c) => `"${c}"`)
            .join(", ")})`
        : "";

    const createSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs.join(", ")}${pkClause})`;
    await target.query(createSql);
    return true;
  } catch {
    return false;
  }
}

function applyMigrationsToTarget() {
  console.log("Aplicando migraciones en Base 2...");
  execSync("npx prisma migrate deploy", {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: DATABASE_URL_TARGET,
    },
    stdio: "inherit",
  });
}

async function copyTable(tableName: string) {
  let exists = await tableExists(target, tableName);
  if (!exists) {
    console.log(`- ${tableName}: no existe en Base 2, creando desde Base 1...`);
    const created = await createTableInTargetFromSource(tableName);
    if (!created) {
      throw new Error(`La tabla "${tableName}" no existe y no se pudo crear en Base 2.`);
    }
    exists = await tableExists(target, tableName);
    if (!exists) {
      throw new Error(`La tabla "${tableName}" no existe en Base 2 despues de crearla.`);
    }
    console.log(`- ${tableName}: tabla creada en Base 2.`);
  }

  const sourceColumns = await getColumns(source, tableName);
  const targetColumns = await getColumns(target, tableName);
  const columns = sourceColumns.filter((c) => targetColumns.includes(c));
  const targetTypes = await getColumnTypes(target, tableName);

  if (columns.length === 0) {
    console.log(`- ${tableName}: sin columnas en comun, se omite.`);
    return;
  }

  const rows = await source.query(`SELECT * FROM "${tableName}"`);
  await target.query(`TRUNCATE TABLE "${tableName}" CASCADE`);

  if (rows.rowCount === 0) {
    console.log(`- ${tableName}: vacia (truncate aplicado).`);
    return;
  }

  let rowsToInsert = rows.rows as Record<string, unknown>[];

  // En algunos entornos, resource_downloads tiene unique(email).
  // Si origen tiene varios registros por el mismo email, dejamos solo el mas reciente.
  if (tableName === "resource_downloads") {
    const byEmail = new Map<string, Record<string, unknown>>();
    for (const row of rowsToInsert) {
      const email = String(row.email ?? "");
      if (!email) continue;
      const current = byEmail.get(email);
      if (!current) {
        byEmail.set(email, row);
        continue;
      }

      const currentDate = current.createdAt ? new Date(String(current.createdAt)).getTime() : 0;
      const nextDate = row.createdAt ? new Date(String(row.createdAt)).getTime() : 0;
      if (nextDate >= currentDate) {
        byEmail.set(email, row);
      }
    }
    rowsToInsert = Array.from(byEmail.values());
    console.log(
      `- ${tableName}: deduplicada por email (${rows.rowCount} -> ${rowsToInsert.length}).`
    );
  }

  const colsSql = columns.map((c) => `"${c}"`).join(", ");
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const insertSql = `INSERT INTO "${tableName}" (${colsSql}) VALUES (${placeholders})`;

  for (const row of rowsToInsert) {
    const values = columns.map((c) => {
      const value = row[c];
      const type = targetTypes[c] || "";

      if (value instanceof Date) {
        return value.toISOString();
      }

      if ((type === "json" || type === "jsonb") && value !== null && value !== undefined) {
        try {
          if (typeof value === "string") {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed);
          }
          return JSON.stringify(value);
        } catch {
          // Si no es JSON valido, dejamos el valor original para no romper columnas no JSON.
          return value;
        }
      }

      return value;
    });
    await target.query(insertSql, values);
  }

  console.log(`- ${tableName}: ${rowsToInsert.length} filas copiadas.`);
}

async function main() {
  console.log("Sync Base 1 -> Base 2 (solo contenido)\n");
  await source.connect();
  await target.connect();

  try {
    applyMigrationsToTarget();
    console.log("\nCopiando tablas de contenido...\n");

    for (const table of CONTENT_TABLES) {
      await copyTable(table);
    }

    console.log("\nListo. Base 2 quedo sincronizada con contenido.");
    console.log("Tablas excluidas: _prisma_migrations, users, accounts, sessions.");
  } finally {
    await source.end();
    await target.end();
  }
}

main().catch((error) => {
  console.error("Error en sincronizacion:", error);
  process.exit(1);
});
