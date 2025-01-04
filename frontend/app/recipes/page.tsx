"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import RecipeList from "@/components/Recipe/RecipeList";

export default function RecipesPage() {
  return (
    <div>
      <Navbar />

      <h1>All recipes</h1>

      <RecipeList />
    </div>
  );
}
