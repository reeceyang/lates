import { WithoutSystemFields } from "convex/server";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { Infer, v } from "convex/values";

export enum DietTags {
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
}

export enum FoodTags {
  PROTEIN = "protein",
  STARCH = "starch",
  VEGETABLE = "vegetable",
  DIZ = "diz",
}

const dishObject = v.object({
  mealId: v.id("meals"),
  name: v.string(),
  tags: v.array(v.string()),
  description: v.optional(v.string()),
});

export type Dish = Doc<"dishes">;

export const newDish = mutation({
  args: { dish: dishObject },
  handler: (ctx, { dish }) => {
    ctx.db.insert("dishes", dish);
  },
});

export const getDishesForMeal = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    return await ctx.db
      .query("dishes")
      .filter((q) => q.eq(q.field("mealId"), mealId))
      .collect();
  },
});

export const get = query({
  args: { dishId: v.id("dishes") },
  handler: async (ctx, { dishId }) => {
    return await ctx.db.get(dishId);
  },
});

export const deleteDish = mutation({
  args: { dishId: v.id("dishes") },
  handler: (ctx, { dishId }) => {
    ctx.db.delete(dishId);
  },
});
