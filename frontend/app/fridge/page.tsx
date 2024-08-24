"use client";

import Navbar from "@/components/Navbar";
import ProductForm from "@/components/Product/ProductForm";
import ProductList from "@/components/Product/ProductList";

export default function FridgePage() {
  return (
    <div>
      <Navbar />
      <h1>All products</h1>
      <ProductList />
      <h1>Add product</h1>
      <ProductForm />
    </div>
  );
}
