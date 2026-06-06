import { all, get, run, logSql } from "../db/dbClient";

export interface CommentRow {
  id: number;
  requestId: number;
  userId: number;
  body: string;
  createdAt: string;
}

function esc(s: string): string {
  return String(s).replace(/'/g, "''");
}

const commentsRepository = {
  getByRequestId(requestId: number): Promise<CommentRow[]> {
    const sql = `
      SELECT id, requestId, userId, body, createdAt
      FROM Comments
      WHERE requestId = ${requestId}
      ORDER BY id ASC;
    `;
    logSql(sql);
    return all<CommentRow>(sql);
  },

  getById(id: number): Promise<CommentRow | undefined> {
    const sql = `
      SELECT id, requestId, userId, body, createdAt
      FROM Comments
      WHERE id = ${id};
    `;
    logSql(sql);
    return get<CommentRow>(sql);
  },

  async create(
    requestId: number,
    userId: number,
    body: string
  ): Promise<CommentRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Comments (requestId, userId, body, createdAt)
      VALUES (${requestId}, ${userId}, '${esc(body)}', '${now}');
    `;
    logSql(sql);
    const result = await run(sql);
    return (await this.getById(result.lastID)) as CommentRow;
  },

  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM Comments WHERE id = ${id};`;
    logSql(sql);
    const result = await run(sql);
    return result.changes > 0;
  },
};

export default commentsRepository;