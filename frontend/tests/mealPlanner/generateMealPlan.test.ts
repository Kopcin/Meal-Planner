import { mockProducts, mockRecipes } from "../../src/data/mockData";
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";

describe("generateMealPlan", () => {
  it("generates the requested number of days and meals", () => {
    const plan = generateMealPlan(mockProducts, mockRecipes, 2, 3, "2026-01-01");

    expect(plan).toHaveLength(2);
    expect(plan[0].mealSlots).toHaveLength(3);
    expect(plan[1].mealSlots).toHaveLength(3);
    expect(plan[0].date).toBe("2026-01-01");
    expect(plan[1].date).toBe("2026-01-02");
  });

  it("does not mutate the products supplied by the caller", () => {
    const products = [...mockProducts];
    const originalOrder = products.map((product) => product.id);

    generateMealPlan(products, mockRecipes, 1, 2, "2026-01-01");

    expect(products.map((product) => product.id)).toEqual(originalOrder);
  });

  it("returns an empty plan when no recipes are available", () => {
    expect(generateMealPlan(mockProducts, [], 7, 3)).toEqual([]);
  });

  it("uses only recipes provided by the caller", () => {
    const plan = generateMealPlan(mockProducts, mockRecipes, 3, 4, "2026-01-01");
    const recipeIds = new Set(mockRecipes.map((recipe) => recipe.id));

    plan.flatMap((day) => day.mealSlots).forEach((meal) => {
      expect(recipeIds.has(meal.recipeId)).toBe(true);
    });
  });
});
