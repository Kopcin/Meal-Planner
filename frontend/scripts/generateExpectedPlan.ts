import fs from "fs";
import path from "path"
import { generateMealPlan } from "@/services/mealPlanner/generateMealPlan";
import { mockProducts, mockRecipes } from "../src/data/mockData";

const plan = generateMealPlan(mockProducts, mockRecipes, "standard");

const filePath = path.resolve(`src/fixtures/expectedStandardPlan.json`);

fs.writeFileSync(filePath, JSON.stringify(plan, null, 2));

console.log(`Plan saved to: ${filePath}`);