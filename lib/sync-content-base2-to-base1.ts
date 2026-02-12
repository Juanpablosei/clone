import "dotenv/config";
import pg from "pg";
import { v2 as cloudinary } from "cloudinary";

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
  "resources",
  "home_page",
  "about_us_page",
  "about_us_testimonials",
  "education_page",
  "research_publications_page",
  "advisory_page",
] as const;

// Solo news hace mirror delete por requerimiento actual.
const DELETE_MIRROR_TABLES = new Set<string>(["news"]);

const DB_SOURCE = process.env.DATABASE_URL_TARGET; // Base 2 (editor)
const DB_TARGET = process.env.DATABASE_URL; // Base 1 (main)

function configureCloudinaryForMain() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_SOURCE_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_SOURCE_API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SOURCE_API_SECRET || process.env.CLOUDINARY_API_SECRET,
  });
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

function extractCloudinaryUrls(value: unknown): string[] {
  const urls: string[] = [];
  if (typeof value === "string") {
    return value.match(/https?:\/\/res\.cloudinary\.com\/[^\s"<>]+/g) || [];
  }
  if (Array.isArray(value)) {
    for (const item of value) urls.push(...extractCloudinaryUrls(item));
    return urls;
  }
  if (value && typeof value === "object") {
    for (const val of Object.values(value as Record<string, unknown>)) {
      urls.push(...extractCloudinaryUrls(val));
    }
  }
  return urls;
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

async function getPrimaryKeys(client: pg.Client, table: string): Promise<string[]> {
  const res = await client.query(
    `SELECT a.attname
     FROM pg_catalog.pg_constraint c
     JOIN pg_catalog.pg_class t ON t.oid = c.conrelid
     JOIN pg_catalog.pg_namespace n ON n.oid = t.relnamespace
     JOIN pg_catalog.pg_attribute a
       ON a.attrelid = c.conrelid
      AND a.attnum = ANY(c.conkey)
     WHERE c.contype = 'p'
       AND n.nspname = 'public'
       AND t.relname = $1
     ORDER BY array_position(c.conkey, a.attnum)`,
    [table]
  );
  return res.rows.map((r) => r.attname as string);
}

function keyForRow(row: Record<string, unknown>, keyCols: string[]): string {
  return keyCols.map((k) => String(row[k] ?? "")).join("||");
}

function sortObjectDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectDeep);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const out: Record<string, unknown> = {};
    for (const [k, v] of entries) out[k] = sortObjectDeep(v);
    return out;
  }
  return value;
}

function normalizeForCompare(value: unknown, type: string, columnName: string): string {
  if (value === null || value === undefined) return "null";
  if (value instanceof Date) {
    if (columnName.toLowerCase() === "date") return value.toISOString().slice(0, 10);
    return value.getTime().toString();
  }
  if (
    (type === "timestamp" || type === "timestamptz" || type === "date" || type === "time" || type === "timetz") &&
    typeof value === "string"
  ) {
    const t = new Date(value).getTime();
    if (!Number.isNaN(t)) {
      if (columnName.toLowerCase() === "date") return new Date(t).toISOString().slice(0, 10);
      return t.toString();
    }
  }
  if (type === "json" || type === "jsonb") {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return JSON.stringify(sortObjectDeep(parsed));
    } catch {
      return String(value);
    }
  }
  if (typeof value === "object") return JSON.stringify(sortObjectDeep(value));
  return String(value);
}

function prepareValue(value: unknown, type: string): unknown {
  if (value instanceof Date) return value.toISOString();
  if ((type === "json" || type === "jsonb") && value !== null && value !== undefined) {
    if (typeof value === "string") {
      try {
        return JSON.stringify(JSON.parse(value));
      } catch {
        return value;
      }
    }
    return JSON.stringify(value);
  }
  return value;
}

async function isUrlUsedInMainDb(client: pg.Client, url: string): Promise<boolean> {
  for (const table of CONTENT_TABLES) {
    try {
      const exists = await tableExists(client, table);
      if (!exists) continue;
      const res = await client.query(
        `SELECT EXISTS (
           SELECT 1
           FROM "${table}" t
           WHERE POSITION($1 IN row_to_json(t)::text) > 0
         ) AS "exists"`,
        [url]
      );
      if (res.rows[0]?.exists) return true;
    } catch {
      continue;
    }
  }
  return false;
}

export async function syncContentBase2ToBase1(log: LogFn = console.log) {
  if (!DB_SOURCE || !DB_TARGET) {
    throw new Error("Faltan DATABASE_URL_TARGET (base2) y/o DATABASE_URL (base1).");
  }

  configureCloudinaryForMain();

  const source = new pg.Client({ connectionString: DB_SOURCE });
  const target = new pg.Client({ connectionString: DB_TARGET });

  const summary = { inserted: 0, updated: 0, deleted: 0 };

  await source.connect();
  await target.connect();

  try {
    log("Iniciando sync Base2 -> Base1 (contenido)...");

    for (const table of CONTENT_TABLES) {
      log(`\n[${table}]`);

      const sourceColumns = await getColumns(source, table);
      const targetColumns = await getColumns(target, table);
      const commonColumns = sourceColumns
        .filter((c) => targetColumns.includes(c))
        .filter((c) => c !== "updatedAt" && c !== "createdAt");
      const insertColumns = [...commonColumns];
      for (const tsCol of ["createdAt", "updatedAt"] as const) {
        if (sourceColumns.includes(tsCol) && targetColumns.includes(tsCol)) insertColumns.push(tsCol);
      }

      if (commonColumns.length === 0) {
        log("  Sin columnas en comun. Se omite.");
        continue;
      }

      const pkCols = await getPrimaryKeys(source, table);
      const keyCols = pkCols.length > 0 ? pkCols : commonColumns.includes("id") ? ["id"] : [];
      if (keyCols.length === 0) {
        log("  Sin PK o id. Se omite por seguridad.");
        continue;
      }

      const targetTypes = await getColumnTypes(target, table);
      const srcRows = (await source.query(`SELECT * FROM "${table}"`)).rows as Record<string, unknown>[];
      const tgtRows = (await target.query(`SELECT * FROM "${table}"`)).rows as Record<string, unknown>[];

      const srcMap = new Map(srcRows.map((r) => [keyForRow(r, keyCols), r]));
      const tgtMap = new Map(tgtRows.map((r) => [keyForRow(r, keyCols), r]));

      for (const [key, srcRow] of srcMap) {
        const tgtRow = tgtMap.get(key);

        if (!tgtRow) {
          const colsSql = insertColumns.map((c) => `"${c}"`).join(", ");
          const placeholders = insertColumns.map((_, i) => `$${i + 1}`).join(", ");
          const values = insertColumns.map((c) => {
            if ((c === "createdAt" || c === "updatedAt") && (srcRow[c] === null || srcRow[c] === undefined)) {
              return new Date().toISOString();
            }
            return prepareValue(srcRow[c], targetTypes[c] || "");
          });
          await target.query(`INSERT INTO "${table}" (${colsSql}) VALUES (${placeholders})`, values);
          summary.inserted++;
          log(`  + insert ${key}`);
          continue;
        }

        const changedCols = commonColumns.filter((c) => {
          const type = targetTypes[c] || "";
          return normalizeForCompare(srcRow[c], type, c) !== normalizeForCompare(tgtRow[c], type, c);
        });
        if (changedCols.length === 0) continue;

        const oldUrls = new Set<string>();
        const newUrls = new Set<string>();
        for (const c of changedCols) {
          for (const u of extractCloudinaryUrls(tgtRow[c])) oldUrls.add(u);
          for (const u of extractCloudinaryUrls(srcRow[c])) newUrls.add(u);
        }
        const urlsToDeleteAfterUpdate = Array.from(oldUrls).filter((oldUrl) => !newUrls.has(oldUrl));

        const setSql = changedCols.map((c, i) => `"${c}" = $${i + 1}`).join(", ");
        const whereSql = keyCols.map((k, i) => `"${k}" = $${changedCols.length + i + 1}`).join(" AND ");
        const values = [
          ...changedCols.map((c) => prepareValue(srcRow[c], targetTypes[c] || "")),
          ...keyCols.map((k) => srcRow[k]),
        ];

        await target.query(`UPDATE "${table}" SET ${setSql} WHERE ${whereSql}`, values);

        for (const oldUrl of urlsToDeleteAfterUpdate) {
          const stillUsed = await isUrlUsedInMainDb(target, oldUrl);
          if (stillUsed) {
            log(`      Cloudinary skip delete (url in use in Base 1): ${oldUrl}`);
            continue;
          }
          await deleteCloudinaryByUrl(oldUrl, log);
        }

        summary.updated++;
        log(`  ~ update ${key} (${changedCols.join(", ")})`);
      }

      for (const [key] of tgtMap) {
        if (!srcMap.has(key)) {
          if (!DELETE_MIRROR_TABLES.has(table)) {
            log(`  = keep ${key} (exists only in Base 1, no delete policy)`);
            continue;
          }

          const rowToDelete = tgtMap.get(key);
          if (!rowToDelete) continue;

          const urlsToDelete = new Set<string>();
          for (const value of Object.values(rowToDelete)) {
            for (const url of extractCloudinaryUrls(value)) urlsToDelete.add(url);
          }

          if (table === "news") {
            const newsId = rowToDelete.id;
            if (newsId) {
              const blocksRes = await target.query(
                `SELECT "imageUrl", "images", "metadata", "content"
                 FROM "news_blocks"
                 WHERE "newsId" = $1`,
                [newsId]
              );
              for (const block of blocksRes.rows as Record<string, unknown>[]) {
                for (const value of Object.values(block)) {
                  for (const url of extractCloudinaryUrls(value)) urlsToDelete.add(url);
                }
              }
            }
          }

          const whereSql = keyCols.map((k, i) => `"${k}" = $${i + 1}`).join(" AND ");
          const whereValues = keyCols.map((k) => rowToDelete[k]);
          await target.query(`DELETE FROM "${table}" WHERE ${whereSql}`, whereValues);

          for (const oldUrl of urlsToDelete) {
            const stillUsed = await isUrlUsedInMainDb(target, oldUrl);
            if (stillUsed) {
              log(`      Cloudinary skip delete (url in use in Base 1): ${oldUrl}`);
              continue;
            }
            await deleteCloudinaryByUrl(oldUrl, log);
          }

          summary.deleted++;
          log(`  - delete ${key} (mirror delete from Base 2)`);
        }
      }
    }

    log(`\nSync completada. Inserts: ${summary.inserted}, Updates: ${summary.updated}, Deletes: ${summary.deleted}`);
    return summary;
  } finally {
    await source.end();
    await target.end();
  }
}

