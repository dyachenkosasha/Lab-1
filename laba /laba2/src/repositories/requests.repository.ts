import { all, get, run, logSql } from "../db/dbClient";

export interface RequestRow {
  id: number;
  userId: number;
  ownerUserId: number;
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
    const queryParams: unknown[] = [];

    if (params.userId) {
      conditions.push("userId = ?");
      queryParams.push(params.userId);
    }
    if (params.status) {
      conditions.push("status = ?");
      queryParams.push(params.status);
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
      SELECT id, userId, ownerUserId, title, severity, status, createdAt
      FROM Requests
      ${where}
      ORDER BY ${sortField} ${order}
      ${limit};
    `;
    logSql(sql, queryParams);
    return all<RequestRow>(sql, queryParams);
  },

  getById(id: number): Promise<RequestRow | undefined> {
    const sql = `
      SELECT id, userId, ownerUserId, title, severity, status, createdAt
      FROM Requests
      WHERE id = ?;
    `;
    logSql(sql, [id]);
    return get<RequestRow>(sql, [id]);
  },

  getByIdAndOwner(
    id: number,
    ownerUserId: number
  ): Promise<RequestRow | undefined> {
    const sql = `
      SELECT id, userId, ownerUserId, title, severity, status, createdAt
      FROM Requests
      WHERE id = ? AND ownerUserId = ?;
    `;
    logSql(sql, [id, ownerUserId]);
    return get<RequestRow>(sql, [id, ownerUserId]);
  },

  getWithAuthors(): Promise<RequestWithAuthorRow[]> {
    const sql = `
      SELECT
        r.id,
        r.userId,
        r.ownerUserId,
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
      SELECT id, userId, ownerUserId, title, severity, status, createdAt
      FROM Requests
      WHERE title LIKE ?
      ORDER BY id DESC;
    `;
    const param = `%${q}%`;
    logSql(sql, [param]);
    return all<RequestRow>(sql, [param]);
  },

  getBySeverity(severity: number): Promise<RequestRow[]> {
    const sql = `
      SELECT id, userId, ownerUserId, title, severity, status, createdAt
      FROM Requests
      WHERE severity = ?
      ORDER BY createdAt DESC;
    `;
    logSql(sql, [severity]);
    return all<RequestRow>(sql, [severity]);
  },

  async create(
    userId: number,
    ownerUserId: number,
    title: string,
    severity: number,
    status: string
  ): Promise<RequestRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Requests (userId, ownerUserId, title, severity, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const params = [userId, ownerUserId, title, severity, status, now];
    logSql(sql, params);
    const result = await run(sql, params);
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
      SET title    = ?,
          severity = ?,
          status   = ?
      WHERE id = ?;
    `;
    const params = [title, severity, status, id];
    logSql(sql, params);
    const result = await run(sql, params);
    if (result.changes === 0) return null;
    return (await this.getById(id)) as RequestRow;
  },

  async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM Requests WHERE id = ?;";
    logSql(sql, [id]);
    const result = await run(sql, [id]);
    return result.changes > 0;
  },
};

export default requestsRepository;
