import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./helpers";

export const getSummary = query({
  args: { currentPeriod: v.string(), previousPeriod: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "viewer"]);

    const branches = await ctx.db.query("branches").collect();
    const activeBranches = branches.filter((b) => b.isActive);

    const currentMetrics = await ctx.db
      .query("branchMetrics")
      .withIndex("by_period", (q) => q.eq("period", args.currentPeriod))
      .collect();

    const previousMetrics = await ctx.db
      .query("branchMetrics")
      .withIndex("by_period", (q) => q.eq("period", args.previousPeriod))
      .collect();

    const totalEmployees = activeBranches.reduce(
      (sum, b) => sum + b.employeeCount,
      0,
    );

    const avgScore =
      currentMetrics.length > 0
        ? currentMetrics.reduce((sum, m) => sum + m.overallScore, 0) /
          currentMetrics.length
        : 0;

    const prevAvgScore =
      previousMetrics.length > 0
        ? previousMetrics.reduce((sum, m) => sum + m.overallScore, 0) /
          previousMetrics.length
        : 0;

    const auditPassed = currentMetrics.filter((m) => m.auditPassed).length;
    const prevAuditPassed = previousMetrics.filter((m) => m.auditPassed).length;

    const bonusCount = currentMetrics.filter((m) => m.bonusEarned).length;
    const prevBonusCount = previousMetrics.filter((m) => m.bonusEarned).length;

    const totalBonus = currentMetrics.reduce(
      (sum, m) => sum + m.bonusAmount,
      0,
    );

    const prevTotalBonus = previousMetrics.reduce(
      (sum, m) => sum + m.bonusAmount,
      0,
    );

    return {
      totalBranches: activeBranches.length,
      totalEmployees,
      avgScore: Math.round(avgScore * 10) / 10,
      scoreChange: Math.round((avgScore - prevAvgScore) * 10) / 10,
      auditPassed,
      auditTotal: activeBranches.length,
      auditChange: auditPassed - prevAuditPassed,
      bonusCount,
      bonusChange: bonusCount - prevBonusCount,
      totalBonus,
      bonusAmountChange: totalBonus - prevTotalBonus,
    };
  },
});
