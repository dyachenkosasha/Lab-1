import { all, get, run, logSql } from "../db/dbClient";

export interface CommentRow {
  id: number;
  requestId: number;
  userId: number;
  body: string;
  createdAt: string;
}

const commentsRepository = {
  getByRequestId(requestId: number): Promise<CommentRow[]> {
    const sql = `
      SELECT id, requestId, userId, body, createdAt
      FROM Comments
      WHERE requestId = ?
      ORDER BY id ASC;
    `;
    logSql(sql, [requestId]);
    return all<CommentRow>(sql, [requestId]);
  },

  getById(id: number): Promise<CommentRow | undefined> {
    const sql = `
      SELECT id, requestId, userId, body, createdAt
      FROM Comments
      WHERE id = ?;
    `;
    logSql(sql, [id]);
    return get<CommentRow>(sql, [id]);
  },

  async create(
    requestId: number,
    userId: number,
    body: string
  ): Promise<CommentRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Comments (requestId, userId, body, createdAt)
      VALUES (?, ?, ?, ?);
    `;
    const params = [requestId, userId, body, now];
    logSql(sql, params);
    const result = await run(sql, params);
    return (await this.getById(result.lastID)) as CommentRow;
  },

  async update(id: number, body: string): Promise<CommentRow | undefined> {
    const sql = "UPDATE Comments SET body = ? WHERE id = ?;";
    logSql(sql, [body, id]);
    await run(sql, [body, id]);
    return this.getById(id);
  },

  async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM Comments WHERE id = ?;";
    logSql(sql, [id]);
    const result = await run(sql, [id]);
    return result.changes > 0;
  },
};

export default commentsRepository;
