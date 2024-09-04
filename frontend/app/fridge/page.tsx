"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/Product/ProductDetail";
import ProductForm from "@/components/Product/ProductForm";
import ProductList from "@/components/Product/ProductList";

export default function FridgePage() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
  };

  return (
    <div>
      <Navbar />

      <h1>All products</h1>

      <ProductList
        onProductClick={handleProductClick}
      />

      <h1>Add product</h1>
      <ProductForm />
    </div>
  );
}
