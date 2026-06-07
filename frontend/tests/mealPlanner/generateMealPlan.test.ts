import { mockProducts, mockRecipes } from "../../src/data/mockData";
import { generateMealPlan, mealTemplates } from "@/services/mealPlanner/generateMealPlan";
import expectedPlan from "@/fixtures/expectedStandardPlan.json";

describe("generateMealPlan", () => {
    it("should not crash when using unknown templateType", () => {
        const plan = generateMealPlan(mockProducts, mockRecipes, "nonexistent" as any);
        expect(plan.length).toBeGreaterThan(0); // fallback to standard
    });

    it("should generate the first 5 meals correctly", () => {
        const plan = generateMealPlan(mockProducts, mockRecipes, "standard");

        const simplifyMeal = (meal: any) => ({
            type: meal.type,
            recipe: meal.recipe,
            availableIngredients: meal.availableIngredients.map((ingredient: any) => ingredient.name),
            missingIngredients: meal.missingIngredients,
        });

        const firstFiveMeals = plan.flatMap(dayPlan => dayPlan.meals)
            .slice(0, 5)
            .map(simplifyMeal);
        const firstFiveExpectedMeals = expectedPlan.flatMap(dayPlan => dayPlan.meals)
            .slice(0, 5)
            .map(simplifyMeal);

        try {
            expect(firstFiveMeals).toEqual(firstFiveExpectedMeals);
        } catch (error) {
            console.table(firstFiveMeals);
            console.table(firstFiveExpectedMeals);
            throw error;
        }
    });

    it(`should include "Spaghetti bolognese" as breakfast on Tuesday for template "standard"`, () => {
        const plan = generateMealPlan(mockProducts, mockRecipes, "standard");
        const tuesdayPlan = plan.find(dayPlan => dayPlan.day === "Tuesday");
        expect(tuesdayPlan).toBeDefined();

        const breakfast = tuesdayPlan?.meals.find(meal => meal.type === "Breakfast");
        expect(breakfast?.recipe).toBe("Spaghetti bolognese");
    })
});

describe("generateMealPlan - template structure", () => {
    Object.entries(mealTemplates).forEach(([templateType, template]) => {
        it(`should generate a meal plan matching "${templateType}" template`, () => {
            const plan = generateMealPlan(mockProducts, mockRecipes, templateType as keyof typeof mealTemplates);

            expect(plan).toHaveLength(Object.keys(template).length);

            const daysFromPlan = plan.map(day => day.day);
            const expectedDays = Object.keys(template);
            expect(daysFromPlan).toEqual(expectedDays);

            plan.forEach(dayPlan => {
                const expectedMeals = template[dayPlan.day as keyof typeof template];
                const actualMeals = dayPlan.meals.map(m => m.type);
                expect(actualMeals).toEqual(expectedMeals);
            });
        });
    });
});
