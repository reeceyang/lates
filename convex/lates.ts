import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { Infer, v } from "convex/values";

export enum ServingMethod {
  FRIDGE = "fridge",
  TABLE = "table",
}

const lateObject = v.object({
  mealId: v.id("meals"),
  name: v.string(),
  servingMethod: v.string(),
  dishIds: v.array(v.id("dishes")),
  description: v.optional(v.string()),
  cancelled: v.optional(v.boolean()),
});

export type Late = Doc<"lates">;

export const newLate = mutation({
  args: { late: lateObject },
  handler: (ctx, { late }) => {
    ctx.db.insert("lates", late);
  },
});

export const getLatesForMeal = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    return await ctx.db
      .query("lates")
      .filter((q) => q.eq(q.field("mealId"), mealId))
      .collect();
  },
});

export const get = query({
  args: { lateId: v.id("lates") },
  handler: async (ctx, { lateId }) => {
    return await ctx.db.get(lateId);
  },
});

export const setIsCancelled = mutation({
  args: { lateId: v.id("lates"), cancelled: v.boolean() },
  handler: (ctx, { lateId, cancelled }) => {
    ctx.db.patch(lateId, { cancelled });
  },
});

export const patch = mutation({
  args: { lateId: v.id("lates"), updatedLate: lateObject },
  handler: (ctx, { lateId, updatedLate }) => {
    ctx.db.patch(lateId, updatedLate);
  },
});
