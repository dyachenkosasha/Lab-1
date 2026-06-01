import { all, get, run, logSql } from "../db/dbClient";

export interface RequestRow {
  id: number;
  userId: number;
  title: string;
  severity: number;
  status: string;
  createdAt: string;
}

export interface RequestWithAuthorRow extends RequestRow {
  authorName: string;
  authorEmail: string;
}

export interface StatusCountRow {
  status: string;
  count: number;
}

function esc(s: string): string {
  return String(s).replace(/'/g, "''");
}

const ALLOWED_SORT_FIELDS = ["id", "severity", "status", "createdAt"];
const ALLOWED_ORDERS = ["asc", "desc"];

const requestsRepository = {
  getAll(params: {
    userId?: number;
    status?: string;
    sort?: string;
    order?: string;
    limit?: number;
  }): Promise<RequestRow[]> {
    const conditions: string[] = [];

    if (params.userId) {
      conditions.push(`userId = ${params.userId}`);
    }
    if (params.status) {
      conditions.push(`status = '${esc(params.status)}'`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortField = ALLOWED_SORT_FIELDS.includes(params.sort ?? "")
      ? params.sort!
      : "id";
    const order = ALLOWED_ORDERS.includes(params.order ?? "")
      ? params.order!
      : "desc";
    const limit = params.limit ? `LIMIT ${Number(params.limit)}` : "LIMIT 100";

    const sql = `
      SELECT id, userId, title, severity, status, createdAt
      FROM Requests
      ${where}
      ORDER BY ${sortField} ${order}
      ${limit};
    `;
    logSql(sql);
    return all<RequestRow>(sql);
  },

  getById(id: number): Promise<RequestRow | undefined> {
    const sql = `
      SELECT id, userId, title, severity, status, createdAt
      FROM Requests
      WHERE id = ${id};
    `;
    logSql(sql);
    return get<RequestRow>(sql);
  },

  getWithAuthors(): Promise<RequestWithAuthorRow[]> {
    const sql = `
      SELECT
        r.id,
        r.userId,
        r.title,
        r.severity,
        r.status,
        r.createdAt,
        u.name  AS authorName,
        u.email AS authorEmail
      FROM Requests r
      INNER JOIN Users u ON u.id = r.userId
      ORDER BY r.id DESC;
    `;
    logSql(sql);
    return all<RequestWithAuthorRow>(sql);
  },

  getStatusCounts(): Promise<StatusCountRow[]> {
    const sql = `
      SELECT status, COUNT(*) AS count
      FROM Requests
      GROUP BY status
      ORDER BY count DESC;
    `;
    logSql(sql);
    return all<StatusCountRow>(sql);
  },

  searchByTitle(q: string): Promise<RequestRow[]> {
    const sql = `
      SELECT id, userId, title, severity, status, createdAt
      FROM Requests
      WHERE title LIKE '%${q}%'
      ORDER BY id DESC;
    `;
    logSql(sql);
    return all<RequestRow>(sql);
  },
// новий метод для отримання запитів за рівнем серйозності (severity)
  getBySeverity(severity: number): Promise<RequestRow[]> {
    const sql = `
      SELECT id, userId, title, severity, status, createdAt
      FROM Requests
      WHERE severity = ${severity}
      ORDER BY createdAt DESC;
    `;
    logSql(sql);
    return all<RequestRow>(sql);
  },

  async create(
    userId: number,
    title: string,
    severity: number,
    status: string
  ): Promise<RequestRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Requests (userId, title, severity, status, createdAt)
      VALUES (${userId}, '${esc(title)}', ${severity}, '${esc(status)}', '${now}');
    `;
    logSql(sql);
    const result = await run(sql);
    return (await this.getById(result.lastID)) as RequestRow;
  },

  async update(
    id: number,
    title: string,
    severity: number,
    status: string
  ): Promise<RequestRow | null> {
    const sql = `
      UPDATE Requests
      SET title    = '${esc(title)}',
          severity = ${severity},
          status   = '${esc(status)}'
      WHERE id = ${id};
    `;
    logSql(sql);
    const result = await run(sql);
    if (result.changes === 0) return null;
    return (await this.getById(id)) as RequestRow;
  },

  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM Requests WHERE id = ${id};`;
    logSql(sql);
    const result = await run(sql);
    return result.changes > 0;
  },
};

export default requestsRepository;