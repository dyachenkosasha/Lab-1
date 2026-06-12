import statsRepository from "../repositories/stats.repository";

export interface TopCommenterResult {
  userId: number;
  commentCountBySeverity: number;
  bestReport: {
    id: number;
    title: string;
    commentCount: number;
  } | null;
}

const statsService = {
  async getTopCommentersBySeverity(severity: number): Promise<TopCommenterResult[]> {
    if (!Number.isFinite(severity) || severity < 1 || severity > 5) {
      throw { status: 400, message: "severity must be a number between 1 and 5" };
    }

    const topCommenters = await statsRepository.getTopCommentersBySeverity(severity);

    if (topCommenters.length === 0) return [];

    const userIds = topCommenters.map((c) => c.userId);
    const bestReports = await statsRepository.getBestReportForUsers(userIds);

    const bestReportMap = new Map<number, typeof bestReports[0]>();
    for (const row of bestReports) {
      if (!bestReportMap.has(row.userId)) {
        bestReportMap.set(row.userId, row);
      }
    }

    return topCommenters.map((commenter) => {
      const best = bestReportMap.get(commenter.userId) ?? null;
      return {
        userId: commenter.userId,
        commentCountBySeverity: commenter.commentCount,
        bestReport: best
          ? {
              id: best.requestId,
              title: best.requestTitle,
              commentCount: best.commentCount,
            }
          : null,
      };
    });
  },
};

export default statsService;
