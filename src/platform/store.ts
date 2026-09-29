import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { emptyState, PlatformError, type State } from "./domain";

export type Store = {
  read(): Promise<State>;
  readAsset(id: string): Promise<Buffer | null>;
  change<T>(
    action: (state: State, assets: AssetWriter) => T | Promise<T>,
  ): Promise<T>;
};
type AssetWriter = {
  put(id: string, data: Buffer): Promise<void>;
  remove(id: string): Promise<void>;
};
function assetId(id: string) {
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/u.test(id))
    throw new PlatformError("invalid-media");
  return id;
}
function encode(state: State) {
  const serialized = JSON.stringify(state);
  if (Buffer.byteLength(serialized) > 32 * 1024 * 1024)
    throw new PlatformError("capacity", 409);
  return serialized;
}
function decode(value: unknown): State {
  const state = value as State;
  if (
    !state ||
    state.version !== 1 ||
    !Array.isArray(state.records) ||
    !Array.isArray(state.submissions) ||
    !Array.isArray(state.sessions) ||
    !Array.isArray(state.audit) ||
    !state.limits
  )
    throw new PlatformError("storage-unavailable", 503);
  return state;
}
export function localStore(directory: string): Store {
  const file = join(resolve(directory), "state.json");
  const read = async () => {
    try {
      return decode(JSON.parse(await readFile(file, "utf8")));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        return emptyState();
      throw error;
    }
  };
  return {
    read,
    async readAsset(id) {
      try {
        return await readFile(join(directory, "media", assetId(id)));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async change(action) {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      // A filesystem lock also coordinates separate local workers. A crashed lock fails closed.
      let lock;
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          lock = await open(join(directory, "write.lock"), "wx", 0o600);
          break;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
          await new Promise((done) => setTimeout(done, 20));
        }
      }
      if (!lock) throw new PlatformError("busy", 503);
      const temporary = `${file}.${randomUUID()}.tmp`;
      const pending = new Map<string, Buffer | null>();
      const created: string[] = [];
      let committed = false;
      try {
        const state = await read();
        const result = await action(state, {
          async put(id, data) {
            pending.set(assetId(id), data);
          },
          async remove(id) {
            pending.set(assetId(id), null);
          },
        });
        const serialized = encode(state);
        if (pending.size)
          await mkdir(join(directory, "media"), {
            recursive: true,
            mode: 0o700,
          });
        for (const [id, data] of pending)
          if (data) {
            const path = join(directory, "media", id);
            const asset = await open(path, "wx", 0o600);
            created.push(path);
            try {
              await asset.writeFile(data);
              await asset.sync();
            } finally {
              await asset.close();
            }
          }
        const handle = await open(temporary, "wx", 0o600);
        try {
          await handle.writeFile(serialized);
          await handle.sync();
        } finally {
          await handle.close();
        }
        await rename(temporary, file);
        committed = true;
        // Unreferenced bytes are inaccessible even if post-commit cleanup fails.
        for (const [id, data] of pending)
          if (!data)
            await rm(join(directory, "media", id), { force: true }).catch(() =>
              console.error("platform_media_cleanup_failed"),
            );
        return result;
      } finally {
        if (!committed)
          for (const path of created) await rm(path, { force: true });
        await rm(temporary, { force: true });
        await lock.close();
        await rm(join(directory, "write.lock"));
      }
    },
  };
}
export function postgresStore(pool: Pool): Store {
  return {
    async readAsset(id) {
      const result = await pool.query(
        "SELECT data FROM heresonare_media WHERE id = $1",
        [assetId(id)],
      );
      return result.rows[0]?.data ?? null;
    },
    async read() {
      const result = await pool.query(
        "SELECT document FROM heresonare_platform WHERE id = 1",
      );
      if (!result.rows[0]) throw new PlatformError("storage-unavailable", 503);
      return decode(result.rows[0].document);
    },
    async change(action) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query(
          "SELECT document FROM heresonare_platform WHERE id = 1 FOR UPDATE",
        );
        if (!result.rows[0])
          throw new PlatformError("storage-unavailable", 503);
        const state = decode(result.rows[0].document);
        const output = await action(state, {
          async put(id, data) {
            await client.query(
              "INSERT INTO heresonare_media (id, data) VALUES ($1, $2)",
              [assetId(id), data],
            );
          },
          async remove(id) {
            await client.query("DELETE FROM heresonare_media WHERE id = $1", [
              assetId(id),
            ]);
          },
        });
        await client.query(
          "UPDATE heresonare_platform SET document = $1::jsonb, updated_at = now() WHERE id = 1",
          [encode(state)],
        );
        await client.query("COMMIT");
        return output;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
let singleton: Store | undefined;
export function storageConfigured() {
  return ["local", "postgres"].includes(process.env.PLATFORM_STORAGE ?? "");
}
export function getStore(): Store {
  if (singleton) return singleton;
  if (
    process.env.PLATFORM_STORAGE === "local" &&
    !process.env.VERCEL &&
    /^http:\/\/127\.0\.0\.1:\d+$/u.test(process.env.PLATFORM_ORIGIN ?? "")
  ) {
    singleton = localStore(
      process.env.PLATFORM_LOCAL_DIRECTORY ??
        resolve(process.cwd(), ".local-platform"),
    );
  } else if (
    process.env.PLATFORM_STORAGE === "postgres" &&
    process.env.DATABASE_URL
  ) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 10000,
    });
    pool.on("error", () => console.error("platform_database_connection_error"));
    singleton = postgresStore(pool);
  } else {
    throw new PlatformError("unavailable", 503);
  }
  return singleton;
}
