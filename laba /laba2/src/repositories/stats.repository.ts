import { all, logSql } from "../db/dbClient";

export interface TopCommenterRow {
  userId: number;
  commentCount: number;
}

export interface BestReportRow {
  userId: number;
  requestId: number;
  requestTitle: string;
  commentCount: number;
}

const statsRepository = {
  getTopCommentersBySeverity(severity: number): Promise<TopCommenterRow[]> {
    const sql = `
      SELECT c.userId, COUNT(c.id) AS commentCount
      FROM Comments c
      INNER JOIN Requests r ON r.id = c.requestId
      WHERE r.severity = ?
      GROUP BY c.userId
      ORDER BY commentCount DESC
      LIMIT 3;
    `;
    logSql(sql, [severity]);
    return all<TopCommenterRow>(sql, [severity]);
  },

  getBestReportForUsers(userIds: number[]): Promise<BestReportRow[]> {
    if (userIds.length === 0) return Promise.resolve([]);
    const placeholders = userIds.map(() => "?").join(", ");
    const sql = `
      SELECT c.userId, c.requestId, r.title AS requestTitle, COUNT(c.id) AS commentCount
      FROM Comments c
      INNER JOIN Requests r ON r.id = c.requestId
      WHERE c.userId IN (${placeholders})
      GROUP BY c.userId, c.requestId
      ORDER BY c.userId, commentCount DESC;
    `;
    logSql(sql, userIds);
    return all<BestReportRow>(sql, userIds);
  },
};

export default statsRepository;
