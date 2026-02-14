import "dotenv/config";
import path from "path";
import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import { execFileSync } from "child_process";

type LogFn = (message: string) => void;

const CONTENT_TABLES = [
  "authors",
  "news",
  "news_blocks",
  "partners",
  "worked",
  "team_members",
  "site_config",
  "resource_downloads",
  "home_page",
  "about_us_page",
  "about_us_testimonials",
  "education_page",
  "research_publications_page",
  "advisory_page",
] as const;

const DB_SOURCE = process.env.DATABASE_URL_SOURCE || process.env.DATABASE_URL; // Base 1 (main)
const DB_TARGET = process.env.DATABASE_URL_TARGET; // Base 2 (editor)

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function extractCloudinaryUrls(value: unknown): string[] {
  const urls: string[] = [];
  if (typeof value === "string") {
    const matches = value.match(/https?:\/\/res\.cloudinary\.com\/[^\s"<>]+/g);
    if (matches) urls.push(...matches);
  } else if (Array.isArray(value)) {
    for (const item of value) urls.push(...extractCloudinaryUrls(item));
  } else if (value && typeof value === "object") {
    for (const val of Object.values(value as Record<string, unknown>)) {
      urls.push(...extractCloudinaryUrls(val));
    }
  }
  return urls;
}

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((p) => p === "upload");
  if (uploadIndex === -1) return null;
  const afterUpload = urlParts.slice(uploadIndex + 1);
  const joined =
    afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))
      ? afterUpload.slice(1).join("/")
      : afterUpload.join("/");
  return joined.replace(/\.[^/.]+$/, "");
}

async function deleteCloudinaryByUrl(url: string, log: LogFn) {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;
  try {
    const imageResult = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    if (imageResult.result === "ok") {
      log(`      Cloudinary delete ${publicId} (image): ok`);
      return;
    }
    const rawResult = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    if (rawResult.result === "ok") {
      log(`      Cloudinary delete ${publicId} (raw): ok`);
      return;
    }
    const autoResult = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    log(`      Cloudinary delete ${publicId} (auto): ${autoResult.result}`);
  } catch (error) {
    log(`      Cloudinary delete failed (${publicId}): ${String(error)}`);
  }
}

async function getColumns(client: pg.Client, table: string): Promise<string[]> {
  const res = await client.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [table]
  );
  return res.rows.map((r) => r.column_name as string);
}

async function getColumnTypes(client: pg.Client, table: string): Promise<Record<string, string>> {
  const res = await client.query(
    `SELECT column_name, data_type, udt_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [table]
  );
  const out: Record<string, string> = {};
  for (const r of res.rows as { column_name: string; data_type: string; udt_name: string }[]) {
    out[r.column_name] = (r.udt_name || r.data_type || "").toLowerCase();
  }
  return out;
}

async function tableExists(client: pg.Client, table: string): Promise<boolean> {
  const res = await client.query(
    `SELECT 1
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1
     LIMIT 1`,
    [table]
  );
  return res.rows.length > 0;
}

async function createTableInTargetFromSource(
  source: pg.Client,
  target: pg.Client,
  tableName: string
): Promise<boolean> {
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

async function getUrlsFromRows(rows: Record<string, unknown>[]): Promise<Set<string>> {
  const urls = new Set<string>();
  for (const row of rows) {
    for (const value of Object.values(row)) {
      for (const url of extractCloudinaryUrls(value)) {
        urls.add(url);
      }
    }
  }
  return urls;
}

export async function resetSystemBase1ToBase2(log: LogFn = console.log) {
  if (!DB_SOURCE || !DB_TARGET) {
    throw new Error("Faltan DATABASE_URL_SOURCE/DATABASE_URL (base1) y/o DATABASE_URL_TARGET (base2).");
  }

  configureCloudinary();

  const source = new pg.Client({ connectionString: DB_SOURCE });
  const target = new pg.Client({ connectionString: DB_TARGET });

  await source.connect();
  await target.connect();

  try {
    log("Iniciando reset del sistema (Base 1 -> Base 2)...");

    // Aplicar migraciones primero
    log("\nAplicando migraciones en Base 2...");
    const prismaCli = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
    const env = {
      ...process.env,
      DATABASE_URL: DB_TARGET,
      // En Vercel, HOME no existe; forzar /tmp para evitar ENOENT de npm/npx
      ...(process.env.VERCEL && { HOME: "/tmp", npm_config_cache: "/tmp/.npm" }),
    };
    execFileSync("node", [prismaCli, "migrate", "deploy"], {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
    });

    log("\nProcesando tablas de contenido...\n");

    for (const table of CONTENT_TABLES) {
      log(`[${table}]`);

      // Verificar que la tabla existe en ambas bases
      const sourceExists = await tableExists(source, table);
      const targetExists = await tableExists(target, table);

      if (!sourceExists) {
        log(`  La tabla no existe en Base 1, se omite.`);
        continue;
      }

      if (!targetExists) {
        log(`  La tabla no existe en Base 2, creando desde Base 1...`);
        const created = await createTableInTargetFromSource(source, target, table);
        if (!created) {
          log(`  ⚠️ No se pudo crear la tabla en Base 2, se omite.`);
          continue;
        }
      }

      // Obtener columnas comunes
      const sourceColumns = await getColumns(source, table);
      const targetColumns = await getColumns(target, table);
      const commonColumns = sourceColumns.filter((c) => targetColumns.includes(c));

      if (commonColumns.length === 0) {
        log(`  Sin columnas en común, se omite.`);
        continue;
      }

      // Obtener datos de ambas bases
      const sourceRows = (await source.query(`SELECT * FROM "${table}"`)).rows as Record<string, unknown>[];
      const targetRows = (await target.query(`SELECT * FROM "${table}"`)).rows as Record<string, unknown>[];

      // Extraer URLs de Cloudinary de ambas bases
      const sourceUrls = await getUrlsFromRows(sourceRows);
      const targetUrls = await getUrlsFromRows(targetRows);

      // Identificar URLs que están en Base 2 pero NO en Base 1
      const urlsToDelete = new Set<string>();
      for (const url of targetUrls) {
        if (!sourceUrls.has(url)) {
          urlsToDelete.add(url);
        }
      }

      // Borrar imágenes de Cloudinary que están solo en Base 2
      if (urlsToDelete.size > 0) {
        log(`  Borrando ${urlsToDelete.size} imagen(es) de Cloudinary que no están en Base 1...`);
        for (const url of urlsToDelete) {
          await deleteCloudinaryByUrl(url, log);
        }
      } else {
        log(`  No hay imágenes en Base 2 que no estén en Base 1.`);
      }

      // TRUNCATE y copiar datos de Base 1 a Base 2
      log(`  Truncando tabla en Base 2...`);
      await target.query(`TRUNCATE TABLE "${table}" CASCADE`);

      if (sourceRows.length === 0) {
        log(`  Base 1 está vacía, tabla truncada.`);
        continue;
      }

      // Preparar datos para insertar
      let rowsToInsert = sourceRows;

      // Deduplicar resource_downloads por email (mantener el más reciente)
      if (table === "resource_downloads") {
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
        log(`  Deduplicado por email: ${sourceRows.length} -> ${rowsToInsert.length}`);
      }

      // Insertar datos
      const targetTypes = await getColumnTypes(target, table);
      const colsSql = commonColumns.map((c) => `"${c}"`).join(", ");
      const placeholders = commonColumns.map((_, i) => `$${i + 1}`).join(", ");
      const insertSql = `INSERT INTO "${table}" (${colsSql}) VALUES (${placeholders})`;

      for (const row of rowsToInsert) {
        const values = commonColumns.map((c) => {
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
              return value;
            }
          }

          return value;
        });
        await target.query(insertSql, values);
      }

      log(`  ✅ ${rowsToInsert.length} fila(s) copiada(s) de Base 1 a Base 2.`);
    }

    log("\n✅ Reset del sistema completado. Base 2 ahora es igual a Base 1.");
  } finally {
    await source.end();
    await target.end();
  }
}
