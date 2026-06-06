import { all, get, run, logSql } from "../db/dbClient";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}
// Новий інтерфейс для рядка з топ коментаторами
export interface TopCommenterRow {
  id: number;
  name: string;
  email: string;
  commentCount: number;
}

function esc(s: string): string {
  return String(s).replace(/'/g, "''");
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
      WHERE id = ${id};
    `;
    logSql(sql);
    return get<UserRow>(sql);
  },

  async create(email: string, name: string): Promise<UserRow> {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO Users (email, name, createdAt)
      VALUES ('${esc(email)}', '${esc(name)}', '${now}');
    `;
    logSql(sql);
    const result = await run(sql);
    return (await this.getById(result.lastID)) as UserRow;
  },

  async update(id: number, name: string): Promise<UserRow | null> {
    const sql = `
      UPDATE Users
      SET name = '${esc(name)}'
      WHERE id = ${id};
    `;
    logSql(sql);
    const result = await run(sql);
    if (result.changes === 0) return null;
    return (await this.getById(id)) as UserRow;
  },

  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM Users WHERE id = ${id};`;
    logSql(sql);
    const result = await run(sql);
    return result.changes > 0;
  },
// Новий метод для отримання топ 7 коментаторів
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