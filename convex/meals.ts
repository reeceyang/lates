import { mutation, query } from "./_generated/server";
import { Infer, v } from "convex/values";
import dayjs from "dayjs";
import { Doc } from "./_generated/dataModel";

const mealObject = v.object({
  datetime: v.number(),
  name: v.string(),
});

export type Meal = Doc<"meals">;

export const newMeal = mutation({
  args: { meal: mealObject },
  handler: (ctx, args) => {
    return ctx.db.insert("meals", args.meal);
  },
});

export const get = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    return await ctx.db.get(mealId);
  },
});

export const getMealsForDate = query({
  args: { datetime: v.number(), timezoneOffset: v.number() },
  handler: async (ctx, { datetime, timezoneOffset }) => {
    const startOfDay = dayjs(datetime)
      .startOf("day")
      .add(timezoneOffset, "minutes")
      .valueOf();
    const endOfDay = dayjs(datetime)
      .endOf("day")
      .add(timezoneOffset, "minutes")
      .valueOf();
    return await ctx.db
      .query("meals")
      .withIndex("by_datetime", (q) =>
        q.gte("datetime", startOfDay).lte("datetime", endOfDay)
      )
      .collect();
  },
});
