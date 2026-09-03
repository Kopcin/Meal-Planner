"use client";

import Navbar from "@/components/Navbar";
import RecipeList from "@/components/Recipe/RecipeList";
import styles from "./recipesPage.module.css";

export default function RecipesPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Recipes</h1>
          <p className={styles.subtitle}>Browse recipes and use them in your meal plans.</p>
        </header>
        <RecipeList />
      </main>
    </div>
  );
}
