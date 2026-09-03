import { Product } from "@/types/Product";
import { Recipe } from "@/types/Recipe";

function createProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    expirationDate: Date
): Product {
    return { id, name, description, price, expirationDate };
}

function createRecipe(
    id: number,
    title: string,
    description: string | null,
    databaseProducts: Product[],
    unassignedProducts: string[],
    image?: string
): Recipe {
    return { id, title, description, databaseProducts, unassignedProducts, image };
}

function futureDate(daysAhead: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
}

export const mockProducts: Product[] = [
    createProduct(1, "ham", "just ham", 16.99, futureDate(5)),
    createProduct(2, "cheese", "", 8.99, futureDate(12)),
    createProduct(3, "bread", "", 3.20, futureDate(6)),
    createProduct(4, "chicken breast", "Boneless chicken breast", 15.00, futureDate(7)),
    createProduct(5, "tomato", "Fresh tomatoes", 4.99, futureDate(3)),
    createProduct(6, "cucumber", "Green cucumber", 2.50, futureDate(10)),
    createProduct(7, "butter", "Salted butter", 5.50, futureDate(14)),
    createProduct(8, "lettuce", "Fresh lettuce", 2.30, futureDate(2)),
    createProduct(9, "pasta", "Pasta (spaghetti)", 2.99, futureDate(20)),
    createProduct(10, "tomato sauce", "Tomato sauce (jar)", 4.50, futureDate(30)),
    createProduct(11, "parmesan", "Parmesan cheese (grated)", 6.00, futureDate(45)),
    createProduct(12, "basil", "Fresh basil", 1.80, futureDate(120)),
];

export const mockRecipes: Recipe[] = [

    createRecipe(1, "Spaghetti bolognese", "",
        mockProducts.filter(p => ["cheese"].includes(p.name)),
        []
    ),

    createRecipe(2, "Sandwich", "Quick and tasty snack",
        mockProducts.filter(p => ["bread", "ham"].includes(p.name)),
        ["lettuce", "tomato"]
    ),

    createRecipe(3, "Fresh Salad", "Healthy green salad",
        mockProducts.filter(p => ["lettuce", "cucumber", "cheese"].includes(p.name)),
        ["olive oil", "vinegar"]
    ),

    createRecipe(4, "Pancakes", "Fluffy breakfast pancakes",
        mockProducts.filter(p => ["flour", "eggs", "milk"].includes(p.name)),
        ["syrup"]
    ),

    createRecipe(5, "Berry Smoothie", "Refreshing drink",
        mockProducts.filter(p => ["yogurt", "strawberries", "bananas"].includes(p.name)),
        []
    ),

    createRecipe(6, "Chicken Salad", "A healthy chicken salad with fresh vegetables",
        mockProducts.filter(p => ["chicken breast", "lettuce", "tomato", "cucumber"].includes(p.name)),
        ["olive oil", "salt", "pepper"]
    ),

    createRecipe(7, "Grilled Chicken", "Tender and juicy grilled chicken",
        mockProducts.filter(p => ["chicken breast"].includes(p.name)),
        ["garlic", "paprika", "olive oil"]
    ),

    createRecipe(8, "Tomato Soup", "Warm and comforting tomato soup",
        mockProducts.filter(p => ["tomato"].includes(p.name)),
        ["onion", "garlic", "cream"]
    ),

    createRecipe(9, "Cucumber Salad", "Refreshing cucumber salad",
        mockProducts.filter(p => ["cucumber", "lettuce"].includes(p.name)),
        ["olive oil", "lemon juice"]
    ),

    createRecipe(10, "Buttered Toast", "Simple but delicious buttered toast",
        mockProducts.filter(p => ["butter"].includes(p.name)),
        []
    ),

    createRecipe(11, "Pasta with Tomato Sauce and Cheese", "Delicious pasta with a savory tomato sauce topped with parmesan cheese.",
        mockProducts.filter(p => ["pasta", "tomato sauce", "parmesan", "basil"].includes(p.name)),
        ["garlic", "olive oil", "salt"]
    ),

];
