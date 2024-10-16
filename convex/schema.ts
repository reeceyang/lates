import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  dishes: defineTable({
    description: v.optional(v.string()),
    mealId: v.id("meals"),
    name: v.string(),
    tags: v.array(v.string()),
  }).index("by_meal", ["mealId"]),

  lates: defineTable({
    dishIds: v.array(v.id("dishes")),
    mealId: v.id("meals"),
    name: v.string(),
    servingMethod: v.string(),
    description: v.optional(v.string()),
    cancelled: v.optional(v.boolean()),
    fulfilled: v.optional(v.boolean()),
  }).index("by_meal", ["mealId"]),

  meals: defineTable({
    datetime: v.float64(),
    name: v.string(),
  }).index("by_datetime", ["datetime"]),
});
