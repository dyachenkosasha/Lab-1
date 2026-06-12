import { all, get, run, logSql } from "../db/dbClient";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface TopCommenterRow {
  id: number;
  name: string;
  email: string;
  commentCount: number;
}

const usersRepository = {
  getAll(): Promise<UserRow[]> {
    const sql = `
      SELECT id, email, name, createdAt
      FROM Users
      ORDER BY id DESC;
    `;
    logSql(sql);
    return all<UserRow>(sql);
  },

  getById(id: number): Promise<UserRow | undefined> {
    const sql = `
      SELECT id, email, name, createdAt
      FROM Users
      WHERE id = ?;
    `;
    logSql(sql, [id]);
    return get<UserRow>(sql, [id]);
  },

  async create(email: string, name: string): Promise<UserRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Users (email, name, createdAt)
      VALUES (?, ?, ?);
    `;
    const params = [email, name, now];
    logSql(sql, params);
    const result = await run(sql, params);
    return (await this.getById(result.lastID)) as UserRow;
  },

  async update(id: number, name: string): Promise<UserRow | null> {
    const sql = `
      UPDATE Users
      SET name = ?
      WHERE id = ?;
    `;
    const params = [name, id];
    logSql(sql, params);
    const result = await run(sql, params);
    if (result.changes === 0) return null;
    return (await this.getById(id)) as UserRow;
  },

  async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM Users WHERE id = ?;";
    logSql(sql, [id]);
    const result = await run(sql, [id]);
    return result.changes > 0;
  },

  getTopCommenters(): Promise<TopCommenterRow[]> {
    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(c.id) AS commentCount
      FROM Users u
      JOIN Comments c ON c.userId = u.id
      GROUP BY u.id
      ORDER BY commentCount DESC
      LIMIT 7;
    `;
    logSql(sql);
    return all<TopCommenterRow>(sql);
  },
};

export default usersRepository;
