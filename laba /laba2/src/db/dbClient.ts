import { db } from "./db";

function all<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

function get<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row as T | undefined);
    });
  });
}

function run(
  sql: string,
  params: unknown[] = []
): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function logSql(sql: string, params?: unknown[]): void {
  if (process.env.NODE_ENV !== "production") {
    const paramsStr = params && params.length ? ` params=${JSON.stringify(params)}` : "";
    console.log("[SQL]", sql.trim().replace(/\s+/g, " ") + paramsStr);
  }
}

export { all, get, run, logSql };
