import { mutation, query } from "./_generated/server";
import { Infer, v } from "convex/values";
import dayjs from "dayjs";

const mealObject = v.object({
  datetime: v.number(),
  name: v.string(),
});

export type Meal = Infer<typeof mealObject>;

export const newMeal = mutation({
  args: { meal: mealObject },
  handler: (ctx, args) => {
    ctx.db.insert("meals", args.meal);
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
      .filter((q) =>
        q.and(
          q.gte(q.field("datetime"), startOfDay),
          q.lte(q.field("datetime"), endOfDay)
        )
      )
      .collect();
  },
});
