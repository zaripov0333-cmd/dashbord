import { mutation } from "./_generated/server";
import { requireAdmin } from "./helpers";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const existingBranches = await ctx.db.query("branches").take(1);

    if (existingBranches.length > 0) {
      return { message: "Ma'lumotlar mavjud" };
    }

    const branchData = [
      {
        name: "Toshkent Markaz",
        address: "Amir Temur 15",
        employeeCount: 32,
      },
      {
        name: "Samarqand",
        address: "Registon 8",
        employeeCount: 24,
      },
      {
        name: "Buxoro",
        address: "Naqshband 42",
        employeeCount: 18,
      },
    ];

    for (const branch of branchData) {
      await ctx.db.insert("branches", {
        ...branch,
        isActive: true,
      });
    }

    return {
      message: "Demo ma'lumotlar qo'shildi",
    };
  },
});
