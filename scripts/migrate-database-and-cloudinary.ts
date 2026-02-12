/**
 * Script de migración completa: Base de datos + Cloudinary
 *
 * IMPORTANTE: Solo LECTURA en origen. NUNCA se borra ni modifica:
 * - La base de datos origen: solo SELECT y pg_dump (schema). No TRUNCATE, DELETE ni DROP.
 * - Cloudinary origen: solo descarga de imágenes por URL (fetch). No se llama a destroy ni ninguna API que borre.
 * Todo lo que escribe (TRUNCATE/INSERT en BD, upload en Cloudinary) se hace únicamente en el DESTINO.
 *
 * Copia toda la base de datos de origen a destino y migra todas las imágenes
 * de Cloudinary origen a Cloudinary destino, actualizando las URLs en los datos.
 *
 * Variables de entorno requeridas:
 * - DATABASE_URL_SOURCE: URL de la BD origen
 * - DATABASE_URL_TARGET: URL de la BD destino
 * - CLOUDINARY_SOURCE_CLOUD_NAME: Cloud name de Cloudinary origen
 * - CLOUDINARY_SOURCE_API_KEY: API key de Cloudinary origen
 * - CLOUDINARY_SOURCE_API_SECRET: API secret de Cloudinary origen
 * - CLOUDINARY_TARGET_CLOUD_NAME: Cloud name de Cloudinary destino
 * - CLOUDINARY_TARGET_API_KEY: API key de Cloudinary destino
 * - CLOUDINARY_TARGET_API_SECRET: API secret de Cloudinary destino
 * 
 * Uso: npx tsx scripts/migrate-database-and-cloudinary.ts
 */

import "dotenv/config";
import pg from "pg";
import { v2 as cloudinarySource } from "cloudinary";
import { v2 as cloudinaryTarget } from "cloudinary";
import fetch from "node-fetch";
import { mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const DATABASE_URL_SOURCE = process.env.DATABASE_URL_SOURCE || process.env.DATABASE_URL;
const DATABASE_URL_TARGET = process.env.DATABASE_URL_TARGET;

if (!DATABASE_URL_SOURCE || !DATABASE_URL_TARGET) {
  console.error("❌ Faltan DATABASE_URL_SOURCE y/o DATABASE_URL_TARGET en .env");
  process.exit(1);
}

// Configurar Cloudinary origen
cloudinarySource.config({
  cloud_name: process.env.CLOUDINARY_SOURCE_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_SOURCE_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SOURCE_API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

// Configurar Cloudinary destino
cloudinaryTarget.config({
  cloud_name: process.env.CLOUDINARY_TARGET_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_TARGET_API_KEY,
  api_secret: process.env.CLOUDINARY_TARGET_API_SECRET,
});

if (!process.env.CLOUDINARY_TARGET_CLOUD_NAME || !process.env.CLOUDINARY_TARGET_API_KEY || !process.env.CLOUDINARY_TARGET_API_SECRET) {
  console.error("❌ Faltan credenciales de Cloudinary destino (CLOUDINARY_TARGET_*)");
  process.exit(1);
}

const clientSource = new pg.Client({ connectionString: DATABASE_URL_SOURCE });
const clientTarget = new pg.Client({ connectionString: DATABASE_URL_TARGET });

// Cache de URLs migradas para evitar duplicados
const imageUrlCache = new Map<string, string>();

// Directorio temporal para descargas
const tempDir = join(process.cwd(), "temp-migration-images");
mkdirSync(tempDir, { recursive: true });

/**
 * Extrae public_id de una URL de Cloudinary
 */
function extractPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  
  if (uploadIndex === -1) return null;
  
  const afterUpload = urlParts.slice(uploadIndex + 1);
  let publicId = "";
  
  if (afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))) {
    publicId = afterUpload.slice(1).join("/");
  } else {
    publicId = afterUpload.join("/");
  }
  
  publicId = publicId.replace(/\.[^/.]+$/, "");
  return publicId;
}

/**
 * Descarga una imagen de Cloudinary origen (solo lectura por HTTP; no se borra ni modifica nada en origen).
 */
async function downloadImageFromCloudinary(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`⚠️  No se pudo descargar ${url}: ${response.statusText}`);
      return null;
    }
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error(`❌ Error descargando ${url}:`, error);
    return null;
  }
}

/**
 * Sube una imagen a Cloudinary destino y retorna la nueva URL
 */
async function uploadToTargetCloudinary(
  buffer: Buffer,
  originalUrl: string,
  folder?: string
): Promise<string | null> {
  try {
    const publicId = extractPublicId(originalUrl);
    if (!publicId) {
      console.warn(`⚠️  No se pudo extraer public_id de ${originalUrl}`);
      return null;
    }

    const base64 = buffer.toString("base64");
    const dataURI = `data:image/jpeg;base64,${base64}`;

    return new Promise((resolve, reject) => {
      cloudinaryTarget.uploader.upload(
        dataURI,
        {
          folder: folder || "migrated",
          public_id: publicId.replace(/^.*\//, ""), // Solo el nombre del archivo
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error(`❌ Error subiendo a Cloudinary destino:`, error);
            reject(error);
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error("No secure_url returned from Cloudinary"));
          }
        }
      );
    });
  } catch (error) {
    console.error(`❌ Error en uploadToTargetCloudinary:`, error);
    return null;
  }
}

/**
 * Migra una URL de imagen: descarga de origen y sube a destino
 */
async function migrateImageUrl(url: string, folder?: string): Promise<string> {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url; // No es Cloudinary, devolver tal cual
  }

  // Si ya migramos esta URL, usar la cacheada
  if (imageUrlCache.has(url)) {
    return imageUrlCache.get(url)!;
  }

  console.log(`  📥 Descargando: ${url}`);
  const buffer = await downloadImageFromCloudinary(url);
  if (!buffer) {
    console.warn(`  ⚠️  No se pudo descargar, manteniendo URL original`);
    return url;
  }

  console.log(`  📤 Subiendo a Cloudinary destino...`);
  const newUrl = await uploadToTargetCloudinary(buffer, url, folder);
  if (!newUrl) {
    console.warn(`  ⚠️  No se pudo subir, manteniendo URL original`);
    return url;
  }

  console.log(`  ✅ Migrada: ${newUrl}`);
  imageUrlCache.set(url, newUrl);
  return newUrl;
}

/**
 * Busca y migra todas las URLs de Cloudinary en un objeto/valor.
 * Preserva Date y Buffer para no romper columnas timestamp/bytea.
 */
async function migrateCloudinaryUrlsInValue(value: unknown, folder?: string): Promise<unknown> {
  if (value instanceof Date) return value;
  if (Buffer.isBuffer(value)) return value;
  if (typeof value === "string") {
    // Buscar URLs de Cloudinary en el string - procesar secuencialmente
    const cloudinaryUrlRegex = /https?:\/\/res\.cloudinary\.com\/[^\s"<>]+/g;
    const matches = value.match(cloudinaryUrlRegex);
    if (matches) {
      let migratedValue = value;
      // Procesar cada URL secuencialmente, una por una
      for (const url of matches) {
        const newUrl = await migrateImageUrl(url, folder);
        migratedValue = migratedValue.replace(url, newUrl);
      }
      return migratedValue;
    }
    return value;
  } else if (Array.isArray(value)) {
    // Procesar arrays secuencialmente, uno por uno
    const migratedArray: unknown[] = [];
    for (const item of value) {
      const migratedItem = await migrateCloudinaryUrlsInValue(item, folder);
      migratedArray.push(migratedItem);
    }
    return migratedArray;
  } else if (value && typeof value === "object" && !(value instanceof Date)) {
    // Procesar objetos secuencialmente, propiedad por propiedad
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = await migrateCloudinaryUrlsInValue(val, folder);
    }
    return result;
  }
  return value;
}

/**
 * Obtiene todas las tablas del esquema public
 */
async function getTables(client: pg.Client): Promise<string[]> {
  const res = await client.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);
  return res.rows.map((r) => r.tablename);
}

/**
 * Obtiene las columnas de una tabla
 */
async function getColumns(client: pg.Client, tableName: string): Promise<string[]> {
  const res = await client.query(
    `SELECT column_name FROM information_schema.columns 
     WHERE table_schema = 'public' AND table_name = $1 
     ORDER BY ordinal_position`,
    [tableName]
  );
  return res.rows.map((r) => r.column_name);
}

/**
 * Obtiene el tipo de datos de cada columna (ej. timestamp with time zone, jsonb, text)
 */
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
  for (const r of res.rows) {
    out[r.column_name] = (r.udt_name || r.data_type || "").toLowerCase();
  }
  return out;
}

/**
 * Comprueba si una tabla existe en la BD destino
 */
async function tableExistsInTarget(tableName: string): Promise<boolean> {
  const res = await clientTarget.query(
    `SELECT 1 FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName]
  );
  return res.rows.length > 0;
}

/**
 * Crea en destino la tabla clonando la estructura desde origen (para que no falte ninguna tabla).
 * Así se pueden copiar todas las tablas (home_page, about_us_page, education_page, resources, etc.)
 * aunque Prisma migrate deploy no las haya creado en destino.
 */
async function createTableInTargetFromSource(tableName: string): Promise<boolean> {
  try {
    const res = await clientSource.query(
      `SELECT a.attname AS name,
              pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
              NOT a.attnotnull AS nullable,
              pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default
       FROM pg_catalog.pg_attribute a
       LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
       WHERE a.attrelid = $1::regclass AND a.attnum > 0 AND NOT a.attisdropped
       ORDER BY a.attnum`,
      [`public.${tableName}`]
    );
    if (res.rows.length === 0) return false;

    const pkRes = await clientSource.query(
      `SELECT a.attname
       FROM pg_catalog.pg_constraint c
       JOIN pg_catalog.pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey) AND NOT a.attisdropped AND a.attnum > 0
       WHERE c.conrelid = $1::regclass AND c.contype = 'p'
       ORDER BY array_position(c.conkey, a.attnum)`,
      [`public.${tableName}`]
    );
    const pkCols = pkRes.rows.map((r: { attname: string }) => r.attname);

    const colDefs = res.rows.map(
      (r: { name: string; type: string; nullable: boolean; default: string | null }) => {
        let def = `"${r.name}" ${r.type}`;
        if (!r.nullable) def += " NOT NULL";
        // Incluir DEFAULT solo si no es nextval (secuencia puede no existir en destino)
        if (r.default && !String(r.default).includes("nextval")) {
          def += ` DEFAULT ${r.default}`;
        }
        return def;
      }
    );
    const pkClause =
      pkCols.length > 0
        ? `, CONSTRAINT "${tableName}_pkey" PRIMARY KEY (${pkCols.map((c) => `"${c}"`).join(", ")})`
        : "";
    const createSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs.join(", ")}${pkClause})`;
    await clientTarget.query(createSql);
    return true;
  } catch {
    return false;
  }
}

/**
 * Añade en destino las columnas que existan en origen pero no en destino.
 * Así la tabla destino queda igual que la origen (ej. team_members con linkedin, x, url).
 */
async function addMissingColumnsToTarget(tableName: string): Promise<void> {
  const sourceCols = await getColumns(clientSource, tableName);
  const targetCols = await getColumns(clientTarget, tableName);
  const missing = sourceCols.filter((c) => !targetCols.includes(c));
  if (missing.length === 0) return;

  const res = await clientSource.query(
    `SELECT a.attname AS name,
            pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
            NOT a.attnotnull AS nullable,
            pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default
     FROM pg_catalog.pg_attribute a
     LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
     WHERE a.attrelid = $1::regclass AND a.attnum > 0 AND NOT a.attisdropped`,
    [`public.${tableName}`]
  );
  const byName: Record<string, { type: string; nullable: boolean; default: string | null }> = {};
  for (const r of res.rows as { name: string; type: string; nullable: boolean; default: string | null }[]) {
    byName[r.name] = { type: r.type, nullable: r.nullable, default: r.default };
  }

  for (const col of missing) {
    const def = byName[col];
    if (!def) continue;
    try {
      let sql = `ALTER TABLE "${tableName}" ADD COLUMN "${col}" ${def.type}`;
      if (!def.nullable) sql += " NOT NULL";
      if (def.default && !String(def.default).includes("nextval")) sql += ` DEFAULT ${def.default}`;
      await clientTarget.query(sql);
      console.log(`  📐 Columna añadida en destino: ${tableName}.${col}`);
    } catch (e) {
      console.warn(`  ⚠️  No se pudo añadir columna ${tableName}.${col}:`, e);
    }
  }
}

/**
 * Clona el esquema (solo estructura) de origen a destino usando pg_dump + psql.
 * pg_dump en origen es solo lectura; la escritura (psql -f) es solo en destino.
 */
function cloneSchemaToTarget(): boolean {
  if (!DATABASE_URL_SOURCE || !DATABASE_URL_TARGET) return false;
  const schemaFile = join(tempDir, "schema.sql");
  try {
    const urlSource = new URL(DATABASE_URL_SOURCE);
    const urlTarget = new URL(DATABASE_URL_TARGET);
    const dbSource = urlSource.pathname.slice(1).replace(/\?.*$/, "");
    const dbTarget = urlTarget.pathname.slice(1).replace(/\?.*$/, "");

    const schemaSql = execSync(
      `pg_dump -s -n public --no-owner --no-acl -h "${urlSource.hostname}" -p ${urlSource.port || 5432} -U "${decodeURIComponent(urlSource.username)}" -d "${dbSource}"`,
      {
        encoding: "utf-8",
        env: { ...process.env, PGPASSWORD: decodeURIComponent(urlSource.password || "") },
      }
    );
    writeFileSync(schemaFile, schemaSql, "utf-8");

    execSync(
      `psql -h "${urlTarget.hostname}" -p ${urlTarget.port || 5432} -U "${decodeURIComponent(urlTarget.username)}" -d "${dbTarget}" -f "${schemaFile}"`,
      {
        encoding: "utf-8",
        env: { ...process.env, PGPASSWORD: decodeURIComponent(urlTarget.password || "") },
      }
    );
    unlinkSync(schemaFile);
    return true;
  } catch {
    try {
      unlinkSync(schemaFile);
    } catch {}
    return false;
  }
}

/**
 * Aplica migraciones de Prisma en la BD destino usando npx prisma migrate deploy.
 * Esto crea todas las tablas necesarias en destino.
 */
async function applyPrismaMigrationsToTarget(): Promise<boolean> {
  if (!DATABASE_URL_TARGET) return false;
  try {
    console.log("  📦 Aplicando migraciones de Prisma en destino...");
    const { stdout, stderr } = await execAsync(
      `npx prisma migrate deploy`,
      {
        env: { ...process.env, DATABASE_URL: DATABASE_URL_TARGET },
        cwd: process.cwd(),
      }
    );
    
    // Mostrar salida de Prisma
    if (stdout) {
      console.log(`  ${stdout.split('\n').filter(l => l.trim()).join('\n  ')}`);
    }
    
    // Solo mostrar errores reales, no warnings
    if (stderr && !stderr.includes("warn") && !stderr.includes("info")) {
      const errorLines = stderr.split('\n').filter(l => l.trim() && !l.includes("warn") && !l.includes("info"));
      if (errorLines.length > 0) {
        console.warn(`  ⚠️  Advertencias: ${errorLines.join('; ')}`);
      }
    }
    
    // Verificar que se crearon tablas
    const tablesCheck = await clientTarget.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const tableCount = parseInt(tablesCheck.rows[0]?.count || '0', 10);
    
    if (tableCount > 0) {
      console.log(`  ✅ Se encontraron ${tableCount} tablas en destino.`);
      return true;
    } else {
      console.warn(`  ⚠️  No se encontraron tablas después de aplicar migraciones.`);
      return false;
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Error aplicando migraciones: ${errorMsg}`);
    if (error instanceof Error && 'stdout' in error) {
      const execError = error as { stdout?: string; stderr?: string };
      if (execError.stdout) console.log(`  Salida: ${execError.stdout}`);
      if (execError.stderr) console.error(`  Error: ${execError.stderr}`);
    }
    return false;
  }
}

/**
 * Copia una tabla completa
 */
async function copyTable(tableName: string) {
  console.log(`\n📋 Copiando tabla: ${tableName}`);
  
  const columns = await getColumns(clientSource, tableName);
  if (columns.length === 0) {
    console.log(`  ⚠️  Tabla ${tableName} no tiene columnas, saltando`);
    return;
  }

  let existsInTarget = await tableExistsInTarget(tableName);
  if (!existsInTarget) {
    console.log(`  📐 La tabla "${tableName}" no existe en destino; creando desde origen...`);
    const created = await createTableInTargetFromSource(tableName);
    if (created) {
      console.log(`  ✅ Tabla "${tableName}" creada en destino.`);
      existsInTarget = true;
    } else {
      console.log(`  ⚠️  No se pudo crear la tabla "${tableName}" en destino, saltando.`);
      return;
    }
  }

  // Usar columnas que existen en destino (y añadir las que falten después del truncate)
  let targetColumns = await getColumns(clientTarget, tableName);
  let columnsToInsert = targetColumns.filter((c) => columns.includes(c));
  if (columnsToInsert.length === 0) {
    console.log(`  ⚠️  No hay columnas en común entre origen y destino, saltando`);
    return;
  }

  // Obtener datos de origen (solo lectura; la BD origen no se modifica nunca)
  const sourceData = await clientSource.query(`SELECT * FROM "${tableName}"`);
  console.log(`  📊 Filas encontradas: ${sourceData.rows.length}`);

  if (sourceData.rows.length === 0) {
    console.log(`  ℹ️  Tabla vacía, saltando`);
    return;
  }

  // Limpiar solo la tabla en DESTINO (origen no se toca)
  await clientTarget.query(`TRUNCATE TABLE "${tableName}" CASCADE`);

  // Añadir en destino las columnas que existan en origen pero no en destino (tabla ya vacía)
  await addMissingColumnsToTarget(tableName);
  targetColumns = await getColumns(clientTarget, tableName);
  columnsToInsert = targetColumns.filter((c) => columns.includes(c));
  if (columnsToInsert.length < columns.length) {
    const missing = columns.filter((c) => !targetColumns.includes(c));
    console.log(`  ℹ️  Columnas en origen no presentes en destino (se omiten): ${missing.join(", ")}`);
  }

  const targetTypes = await getColumnTypes(clientTarget, tableName);

  // Migrar imágenes y copiar datos - PROCESO SECUENCIAL (una fila a la vez)
  let migrated = 0;
  const folder = tableName.includes("team") ? "team" : 
                 tableName.includes("news") ? "news" :
                 tableName.includes("partner") ? "partners" :
                 tableName.includes("about") ? "about-us" : "migrated";

  for (let i = 0; i < sourceData.rows.length; i++) {
    const row = sourceData.rows[i];

    // Procesar cada columna secuencialmente
    const migratedRow: Record<string, unknown> = {};
    for (const col of columnsToInsert) {
      const value = (row as Record<string, unknown>)[col];
      migratedRow[col] = await migrateCloudinaryUrlsInValue(value, folder);
    }

    // Serializar según tipo en destino: Date -> ISO; json/jsonb -> string JSON válida
    const values = columnsToInsert.map((col) => {
      const v = migratedRow[col];
      if (v instanceof Date) return v.toISOString();
      const type = targetTypes[col] || "";
      if ((type === "json" || type === "jsonb") && v !== null && v !== undefined) {
        try {
          if (typeof v === "string") {
            const parsed = JSON.parse(v);
            return JSON.stringify(parsed);
          }
          return JSON.stringify(v);
        } catch {
          return v;
        }
      }
      return v;
    });

    const colsList = columnsToInsert.map((c) => `"${c}"`).join(", ");
    const placeholders = columnsToInsert.map((_, i) => `$${i + 1}`).join(", ");

    // Insertar fila - esperar antes de continuar
    await clientTarget.query(
      `INSERT INTO "${tableName}" (${colsList}) VALUES (${placeholders})`,
      values
    );
    
    migrated++;
    // Mostrar progreso cada 10 filas o en la última
    if (migrated % 10 === 0 || migrated === sourceData.rows.length) {
      console.log(`  ✅ Procesadas ${migrated}/${sourceData.rows.length} filas`);
    }
  }

  console.log(`  ✅ Tabla ${tableName} completada: ${migrated} filas migradas`);
}

/**
 * Función principal
 */
async function main() {
  console.log("🚀 Iniciando migración completa de BD y Cloudinary\n");
  console.log(`📦 Origen: ${(DATABASE_URL_SOURCE ?? "").split("@")[1] || "..."}`);
  console.log(`📦 Destino: ${(DATABASE_URL_TARGET ?? "").split("@")[1] || "..."}`);
  console.log(`☁️  Cloudinary origen: ${cloudinarySource.config().cloud_name}`);
  console.log(`☁️  Cloudinary destino: ${cloudinaryTarget.config().cloud_name}\n`);

  try {
    await clientSource.connect();
    console.log("✅ Conectado a BD origen");
    
    await clientTarget.connect();
    console.log("✅ Conectado a BD destino\n");

    console.log("📐 Creando esquema en BD destino...\n");
    
    // Primero intentar con Prisma (más confiable y no requiere pg_dump)
    console.log("1️⃣  Intentando aplicar migraciones de Prisma...");
    let schemaReady = await applyPrismaMigrationsToTarget();
    
    if (schemaReady) {
      console.log("\n✅ Esquema creado correctamente usando Prisma migrate deploy.\n");
    } else {
      // Si Prisma falla, intentar con pg_dump como alternativa
      console.log("\n2️⃣  Prisma falló, intentando con pg_dump como alternativa...");
      const schemaCloned = cloneSchemaToTarget();
      if (schemaCloned) {
        console.log("✅ Esquema clonado correctamente usando pg_dump.\n");
        schemaReady = true;
      } else {
        console.log("\n❌ ERROR: No se pudo crear el esquema en destino.");
        console.log("   El script necesita que las tablas existan antes de copiar datos.");
        console.log(`\n   Ejecuta manualmente este comando primero:`);
        console.log(`   DATABASE_URL="${DATABASE_URL_TARGET}" npx prisma migrate deploy\n`);
        throw new Error("No se pudo crear el esquema en la BD destino. Ejecuta las migraciones manualmente primero.");
      }
    }
    
    if (!schemaReady) {
      throw new Error("No se pudo crear el esquema en la BD destino.");
    }

    // Verificar que hay tablas en destino antes de continuar
    const targetTables = await getTables(clientTarget);
    if (targetTables.length === 0) {
      throw new Error("No se encontraron tablas en la BD destino después de crear el esquema. Verifica que las migraciones se aplicaron correctamente.");
    }
    console.log(`✅ Verificado: ${targetTables.length} tablas encontradas en destino.\n`);

    const allTables = await getTables(clientSource);
    const tables = allTables.filter((t) => t !== "_prisma_migrations");
    if (allTables.length !== tables.length) {
      console.log("ℹ️  Se omite la tabla _prisma_migrations (usa las migraciones de Prisma en destino).\n");
    }
    console.log(`📋 Tablas a copiar: ${tables.length}\n`);

    // Procesar tablas secuencialmente, una por una
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      try {
        console.log(`\n[${i + 1}/${tables.length}] Procesando tabla: ${table}`);
        await copyTable(table);
      } catch (error) {
        console.error(`❌ Error copiando tabla ${table}:`, error);
        // Continuar con las siguientes tablas
      }
    }

    console.log("\n✅ Migración completada");
    console.log(`📊 URLs de imágenes migradas: ${imageUrlCache.size}`);
    
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  } finally {
    await clientSource.end();
    await clientTarget.end();
    
    // Limpiar directorio temporal
    try {
      // En un script real podrías limpiar archivos temporales aquí
    } catch {}
  }
}

main().catch((err) => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
