# dashbord
HOTY DOGY DASHBORD
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("viewer")),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_role", ["role"]),

  branches: defineTable({
    name: v.string(),
    address: v.string(),
    managerId: v.optional(v.id("users")),
    employeeCount: v.number(),
    isActive: v.boolean(),
  }).index("by_name", ["name"]),

  branchMetrics: defineTable({
    branchId: v.id("branches"),
    period: v.string(),
    overallScore: v.number(),
    auditScore: v.number(),
    auditPassed: v.boolean(),
    cameraScore: v.number(),
    cleanlinessScore: v.number(),
    serviceScore: v.number(),
    salesScore: v.number(),
    bonusEarned: v.boolean(),
    bonusAmount: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_branch", ["branchId"])
    .index("by_period", ["period"])
    .index("by_branch_and_period", ["branchId", "period"]),

  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    maxScore: v.number(),
    isActive: v.boolean(),
  }).index("by_name", ["name"]),
});
