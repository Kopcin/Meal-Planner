"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";

interface ProductListProps {
  onProductClick: (id: number) => void;
  selectedProductId?: number | null;
}

export default function ProductList({
  onProductClick,
  selectedProductId,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/product/");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}
